// API Configuration
// This file centralizes all API endpoints for the mobile app

// Determine the base URL based on environment
// __DEV__ is a React Native global that's true in development mode
const BASE_URL = __DEV__
    ? "https://rhevo-backend.onrender.com"  // Using production for testing
    : "https://rhevo-backend.onrender.com";  // Production server

// API Endpoints
const API = {
    // Base URL
    BASE_URL,

    // Authentication endpoints
    AUTH: {
        LOGIN: `${BASE_URL}/api/auth/login`,
        REGISTER: `${BASE_URL}/api/auth/register`,
    },

    // Playlist endpoints
    PLAYLISTS: {
        GET_ALL: `${BASE_URL}/api/playlists`,
        CREATE: `${BASE_URL}/api/playlists`,
        GET_BY_ID: (id) => `${BASE_URL}/api/playlists/${id}`,
        UPDATE: (id) => `${BASE_URL}/api/playlists/${id}`,
        DELETE: (id) => `${BASE_URL}/api/playlists/${id}`,
        LIKE: (id) => `${BASE_URL}/api/playlists/${id}/like`,
    },
};

export default API;
