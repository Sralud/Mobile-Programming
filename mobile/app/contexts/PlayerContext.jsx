import React, { createContext, useContext, useState, useEffect } from 'react';
import { Audio } from 'expo-av';

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
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
    const playTrack = async (track) => {
        try {
            console.log('PlayTrack called with:', track);

            // Stop and unload previous sound if exists
            if (sound) {
                console.log('Stopping previous sound');
                try {
                    await sound.stopAsync();
                    await sound.unloadAsync();
                } catch (unloadError) {
                    console.log('Error unloading previous sound:', unloadError.message);
                    // Continue anyway - sound may not have loaded successfully
                }
            }

            // Set the new track
            setCurrentTrack(track);
            console.log('Current track set to:', track.title);

            // Check if track has audioUrl
            if (!track.audioUrl) {
                console.log('No audio URL provided for track');
                return;
            }

            console.log('Loading audio from:', track.audioUrl);

            // Load and play new sound
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.audioUrl },
                { shouldPlay: true }
            );

            console.log('Audio loaded successfully');
            setSound(newSound);
            setIsPlaying(true);

            // Set up playback status update
            newSound.setOnPlaybackStatusUpdate((status) => {
                if (status.isLoaded) {
                    setIsPlaying(status.isPlaying);
                    setPosition(status.positionMillis || 0);
                    setDuration(status.durationMillis || 0);

                    // Handle track finish
                    if (status.didJustFinish) {
                        setIsPlaying(false);
                        setPosition(0);
                    }
                }
            });
        } catch (error) {
            console.log('Error playing track:', error);
        }
    };

    // Function to toggle play/pause
    const togglePlayPause = async () => {
        if (!sound) return;

        try {
            if (isPlaying) {
                await sound.pauseAsync();
            } else {
                await sound.playAsync();
            }
        } catch (error) {
            console.log('Error toggling playback:', error);
        }
    };

    // Function to clear player state (for logout)
    const clearPlayer = async () => {
        try {
            if (sound) {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            setSound(null);
            setCurrentTrack(null);
            setIsPlaying(false);
            setPosition(0);
            setDuration(0);
        } catch (error) {
            console.log('Error clearing player:', error);
        }
    };

    return (
        <PlayerContext.Provider value={{
            currentTrack,
            setCurrentTrack,
            sound,
            isPlaying,
            position,
            duration,
            playTrack,
            togglePlayPause,
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
