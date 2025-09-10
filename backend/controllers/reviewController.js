const reviewodel = require('../models/Review');
const userModel = require('../models/User');

module.exports.createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const artistId = req.params.artistId;   // Artist ID from route
        const clientId = req.user._id;          // Login user (from middileware)

        // Check valid artist
        const artist = await userModel.findById(artistId);
        if (!artist || artist.role !== 'artist') {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }

        // check allredy reviewed exist or not (only one times review to one artist)
        const existingReview = await reviewodel.findOne({ clientId, artistId });
        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this artist'
            });
        }

        // create new review
        const newReview = await reviewodel.create({
            clientId,
            artistId,
            rating,
            comment
        });

        artist.reviews.push(newReview._id)
        await artist.save();

        return res.status(201).json({
            success: true,
            message: 'Review added successfully',
            data: newReview
        });

    } catch (error) {
        console.error('Error creating review:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
