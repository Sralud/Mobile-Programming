import express from 'express';
import "dotenv/config.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import playlistRoutes from "./routes/playlistRoutes.js";
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Root route for health check
app.get("/", (req, res) => {
    res.json({
        message: "Rhevo Backend API is running! 🎵",
        status: "active",
        endpoints: {
            auth: "/api/auth",
            playlists: "/api/playlists"
        }
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/playlists", playlistRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
});