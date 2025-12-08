import Playlist from '../models/playlistModel.js';

// Create new playlist
export const createPlaylist = async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ message: 'Playlist name is required' });
        }

        const playlist = new Playlist({
            name,
            userId,
            songs: []
        });

        await playlist.save();
        res.status(201).json({ message: 'Playlist created successfully', playlist });
    } catch (error) {
        console.error('Error creating playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all user playlists
export const getUserPlaylists = async (req, res) => {
    try {
        const userId = req.user.id;
        const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get playlist by ID
export const getPlaylistById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const playlist = await Playlist.findOne({ _id: id, userId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json(playlist);
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update playlist name
export const updatePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
            return res.status(400).json({ message: 'Playlist name is required' });
        }

        const playlist = await Playlist.findOneAndUpdate(
            { _id: id, userId },
            { name },
            { new: true }
        );

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete playlist
export const deletePlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const playlist = await Playlist.findOneAndDelete({ _id: id, userId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        res.json({ message: 'Playlist deleted successfully' });
    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Add song to playlist
export const addSongToPlaylist = async (req, res) => {
    try {
        const { id } = req.params;
        const { deezerTrackId, title, artist, image, audioUrl, duration } = req.body;
        const userId = req.user.id;

        if (!deezerTrackId || !title || !artist || !image || !audioUrl) {
            return res.status(400).json({ message: 'Missing required song fields' });
        }

        const playlist = await Playlist.findOne({ _id: id, userId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Check if song already exists in playlist
        const songExists = playlist.songs.some(song => song.deezerTrackId === deezerTrackId);
        if (songExists) {
            return res.status(400).json({ message: 'Song already in playlist' });
        }

        playlist.songs.push({
            deezerTrackId,
            title,
            artist,
            image,
            audioUrl,
            duration
        });

        // Update cover image to first song's image if not set
        if (!playlist.coverImage && playlist.songs.length > 0) {
            playlist.coverImage = image;
        }

        await playlist.save();
        res.json({ message: 'Song added to playlist', playlist });
    } catch (error) {
        console.error('Error adding song to playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (req, res) => {
    try {
        const { id, songId } = req.params;
        const userId = req.user.id;

        const playlist = await Playlist.findOne({ _id: id, userId });

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        playlist.songs = playlist.songs.filter(song => song._id.toString() !== songId);

        // Update cover image if we removed the first song
        if (playlist.songs.length > 0) {
            playlist.coverImage = playlist.songs[0].image;
        } else {
            playlist.coverImage = null;
        }

        await playlist.save();
        res.json({ message: 'Song removed from playlist', playlist });
    } catch (error) {
        console.error('Error removing song from playlist:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export default {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist
};
