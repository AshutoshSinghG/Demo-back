const mongoose = require('mongoose');

const availableSlotSchema = new mongoose.Schema({
    day: {
        type: String,
        required: [true, 'Day is required'],
        trim: true
    },
    startTime: {
        type: String,
        required: [true, 'Start time is required'],
        trim: true
    },
    endTime: {
        type: String,
        required: [true, 'End time is required'],
        trim: true
    }
}, { _id: false });  // Prevent creating extra _id for subdocuments

const serviceSchema = new mongoose.Schema(
    {
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Artist reference is required']
        },
        title: {
            type: String,
            required: [true, 'Service title is required'],
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Service description is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required']
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price must be a positive number']
        },
        priceType: {
            type: String,
            enum: ['per_hour', 'per_session', 'fixed'],
            required: [true, 'Price type is required']
        },
        availableSlots: [availableSlotSchema]
    },
    {
        timestamps: true 
    }
);

module.exports = mongoose.model('Service', serviceSchema);
