import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.1.10:3000/api';

// Get auth token
const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        return token;
    } catch (error) {
        console.log('Error getting token:', error);
        return null;
    }
};

// Playlist API calls
export const playlistAPI = {
    // Get all user playlists
    getPlaylists: async () => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    },

    // Create new playlist
    createPlaylist: async (name) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        return response.json();
    },

    // Get playlist by ID
    getPlaylistById: async (id) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    },

    // Update playlist name
    updatePlaylist: async (id, name) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        });
        return response.json();
    },

    // Delete playlist
    deletePlaylist: async (id) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    },

    // Add song to playlist
    addSongToPlaylist: async (playlistId, song) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists/${playlistId}/songs`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(song)
        });
        return response.json();
    },

    // Remove song from playlist
    removeSongFromPlaylist: async (playlistId, songId) => {
        const token = await getToken();
        const response = await fetch(`${API_URL}/playlists/${playlistId}/songs/${songId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.json();
    }
};
