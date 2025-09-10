const userModel = require('../models/User');

// Fetch all artist profiles
module.exports.getAllArtists = async (req, res) => {
    try {
        const artists = await userModel.find({ role: 'artist' }).select('-password');

        return res.status(200).json({
            success: true,
            message: 'All artists fetched successfully',
            artist: artists
        });
    } catch (error) {
        console.error('Error fetching artists:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
