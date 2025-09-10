const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Client reference is required']
        },
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Artist reference is required']
        },
        rating: {
            type: Number,
            required: [true, 'Rating is required'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        comment: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Review', reviewSchema);
