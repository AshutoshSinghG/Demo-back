const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Artist reference is required']
        },
        title: {
            type: String,
            required: [true, 'Portfolio title is required'],
            trim: true
        },
        description: {
            type: String,
            trim: true,
            default: ''
        },
        images: [{
            type: String,
            trim: true
        }],
        mediaUrl: {
            type: String,
            trim: true,
            default: ''
        },
        projectType: {
            type: String,
            trim: true,
            default: ''
        },
        caseStudy: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
