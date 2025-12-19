import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [queue, setQueue] = useState([]);
    const [originalQueue, setOriginalQueue] = useState([]); // To preserve order when shuffling
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [isShuffling, setIsShuffling] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
    const [currentTrack, setCurrentTrack] = useState(null);
    const [sound, setSound] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync().catch(() => { });
            }
        };
    }, [sound]);

    // Function to play a new track
    const playTrack = async (track, newQueue = null) => {
        try {
            console.log('PlayTrack called with:', track.title);

            // Update queue if provided
            if (newQueue) {
                setOriginalQueue(newQueue);
                if (isShuffling) {
                    // If shuffling, we just set the queue as the new list but keep shuffle logic? 
                    // Actually simplest is to make the current playing song first, then shuffle the rest
                    // For now, let's just set the queue matching the order
                    const shuffled = [...newQueue].sort(() => Math.random() - 0.5);
                    // Ensure the clicked track is first or found
                    const trackIndex = shuffled.findIndex(t => t.id === track.id);
                    if (trackIndex !== -1) {
                        // Move it to start or just set index
                        // Let's just keep simple shuffle: Random access when next is clicked? 
                        // Common approach: Shuffle current queue array. 
                        // Let's just set queue to newQueue for now. Shuffle logic handles the order or next index.
                    }
                    setQueue(newQueue); // If we want true shuffle queue manipulation we'd do it here. 
                    // But keeping it simple: Shuffle just picks random next index or maps indices.
                } else {
                    setQueue(newQueue);
                }

                // Find index
                const index = newQueue.findIndex(t => t.id.toString() === track.id.toString());
                setCurrentIndex(index !== -1 ? index : 0);
            } else {
                // If no new queue is passed, but we are playing a track, check if it's in current queue
                // If not, maybe make it a queue of 1
                if (queue.length === 0) {
                    setQueue([track]);
                    setOriginalQueue([track]);
                    setCurrentIndex(0);
                } else {
                    // Try to find in current queue
                    const index = queue.findIndex(t => t.id.toString() === track.id.toString());
                    if (index !== -1) setCurrentIndex(index);
                    else {
                        // Add to queue? Or replace? Let's add to end and play
                        const updatedQueue = [...queue, track];
                        setQueue(updatedQueue);
                        setOriginalQueue(updatedQueue);
                        setCurrentIndex(updatedQueue.length - 1);
                    }
                }
            }

            // Stop and unload previous sound if exists
            if (sound) {
                try {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                } catch (unloadError) {
                    console.log('Error unloading:', unloadError.message);
                }
            }

            setCurrentTrack(track);

            if (!track.audioUrl) {
                console.log('No audio URL');
                return;
            }

            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.audioUrl },
                { shouldPlay: true }
            );

            setSound(newSound);
            setIsPlaying(true);

            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                    setPosition(status.positionMillis || 0);
                    setDuration(status.durationMillis || 0);

                    if (status.didJustFinish) {
                        playNext();
                    }
                }
            });
        } catch (error) {
            console.log('Error playing track:', error);
        }
    };

    const playNext = async () => {
        if (queue.length === 0) return;

        let nextIndex = currentIndex;

        if (repeatMode === 'one') {
            // Replay current
            nextIndex = currentIndex;
        } else if (isShuffling) {
            // Random index
            nextIndex = Math.floor(Math.random() * queue.length);
        } else {
            // Next in line
            nextIndex = currentIndex + 1;
        }

        // Check bounds
        if (nextIndex >= queue.length) {
            if (repeatMode === 'all') {
                nextIndex = 0;
            } else {
                // End of playlist
                setIsPlaying(false);
                return;
            }
        }

        playTrack(queue[nextIndex]);
    };

    const playPrevious = async () => {
        if (queue.length === 0) return;

        let prevIndex = currentIndex - 1;
        if (prevIndex < 0) {
            prevIndex = queue.length - 1; // Loop back or stop? Let's loop for prev
        }

        // If shuffle is on, history is usually preferred, but random for now
        if (isShuffling) {
            prevIndex = Math.floor(Math.random() * queue.length);
        }

        playTrack(queue[prevIndex]);
    };

    const togglePlayPause = async () => {
        if (!sound) return;
        try {
            if (isPlaying) await sound.pauseAsync();
            else await sound.playAsync();
        } catch (error) { console.log(error); }
    };

    const toggleShuffle = () => setIsShuffling(!isShuffling);

    const toggleRepeat = () => {
        const modes = ['off', 'all', 'one'];
        const next = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
        setRepeatMode(next);
    };

    const clearPlayer = async () => {
        if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
        }
        setSound(null);
        setCurrentTrack(null);
        setIsPlaying(false);
        setPosition(0);
        setDuration(0);
        setQueue([]);
        setCurrentIndex(-1);
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            setCurrentTrack,
            sound,
            isPlaying,
            position,
            duration,
            queue,
            isShuffling,
            repeatMode,
            playTrack,
            playNext,
            playPrevious,
            togglePlayPause,
            toggleShuffle,
            toggleRepeat,
            clearPlayer
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
