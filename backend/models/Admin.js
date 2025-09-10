const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/.+\@.+\..+/, 'Please provide a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters long']
        },
        role: {
            type: String,
            enum: ['superadmin', 'moderator'],
            required: [true, 'Role is required'],
            default: 'moderator'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Admin', adminSchema);
