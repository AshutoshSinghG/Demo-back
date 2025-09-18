const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/.+\@.+\..+/, 'Please fill a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long']
        },
        mobile: {
            type: Number,
            required: [true, 'Mobile is required'],
            minlength: 10,
            maxlength: 12,
        },
        role: {
            type: String,
            enum: ['client', 'artist'],
            default: 'client'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        VerificationEmailToken: String,
        resetPaswordToken: String,
        services: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        reviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }],
        portfolio: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Portfolio'
        },
        massages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('User', userSchema);
