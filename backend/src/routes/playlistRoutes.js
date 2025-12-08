import express from 'express';
const router = express.Router();
import playlistController from '../controllers/playlistController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

// All routes require authentication
router.use(authMiddleware);

// Playlist CRUD
router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getUserPlaylists);
router.get('/:id', playlistController.getPlaylistById);
router.put('/:id', playlistController.updatePlaylist);
router.delete('/:id', playlistController.deletePlaylist);

// Song management
router.post('/:id/songs', playlistController.addSongToPlaylist);
router.delete('/:id/songs/:songId', playlistController.removeSongFromPlaylist);

export default router;
