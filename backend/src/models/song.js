import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    // album name or single release
    album: {
      type: String,
      default: "Single",
      trim: true,
    },

    // image URL for album art
    coverImage: {
      type: String,
      required: true,
    },

    // audio file link (Cloudinary / Firebase / local)
    audioUrl: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // seconds
      required: true,
    },

    genre: {
      type: String,
      trim: true,
    },

    // For the Create tab + Suno AI integration
    createdByAI: {
      type: Boolean,
      default: false,
    },

    // For storing the prompt used to generate the AI track
    aiPrompt: {
      type: String,
      default: "",
    },

    // Track stats
    likes: {
      type: Number,
      default: 0,
    },

    plays: {
      type: Number,
      default: 0,
    },

    // Optional: store user who uploaded or created the track
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },

  // timestamps = createdAt + updatedAt will be auto-generated
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);