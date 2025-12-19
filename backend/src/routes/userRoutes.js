import express from "express";
import User from "../models/User.js";
import { authMiddleware as protect } from "../middleware/authMiddleware.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

// ====================== GET PROFILE ======================
router.get("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// ====================== UPDATE PROFILE ======================
router.put("/profile", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;

            if (req.body.password && req.body.currentPassword) {
                const isMatch = await user.comparePassword(req.body.currentPassword);
                if (!isMatch) {
                    return res.status(401).json({ message: "Invalid current password" });
                }
                user.password = req.body.password;
            } else if (req.body.password && !req.body.currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password" });
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                profileImage: updatedUser.profileImage,
                likedSongs: updatedUser.likedSongs,
                token: req.headers.authorization.split(" ")[1] // Return generic or same token
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log("Update Profile Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ====================== LIEK SONG ======================
router.post("/like", protect, async (req, res) => {
    try {
        const { id, title, artist, image, audioUrl } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            // Check if song already liked
            const alreadyLiked = user.likedSongs.find(song => song.id === id.toString());

            if (alreadyLiked) {
                // Unlike if already liked
                user.likedSongs = user.likedSongs.filter(song => song.id !== id.toString());
                await user.save();
                res.json({ message: "Song unliked", likedSongs: user.likedSongs });
            } else {
                // Like
                const song = { id, title, artist, image, audioUrl };
                user.likedSongs.push(song);
                await user.save();
                res.json({ message: "Song liked", likedSongs: user.likedSongs });
            }
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log("Like Song Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// ====================== GET LIKED SONGS ======================
router.get("/liked", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json(user.likedSongs);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;
