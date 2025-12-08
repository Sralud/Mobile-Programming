import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    songs: [{
        deezerTrackId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        artist: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        audioUrl: {
            type: String,
            required: true
        },
        duration: Number,
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    coverImage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Virtual for song count
playlistSchema.virtual('songCount').get(function () {
    return this.songs.length;
});

// Ensure virtuals are included in JSON
playlistSchema.set('toJSON', { virtuals: true });
playlistSchema.set('toObject', { virtuals: true });

export default mongoose.model('Playlist', playlistSchema);
