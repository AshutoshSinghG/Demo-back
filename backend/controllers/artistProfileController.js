const userModel = require('../models/User');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Portfolio = require('../models/Portfolio');

//users/clients see artist profile
module.exports.getArtistProfile = async (req, res) => {
    try {
        const artistId = req.params.id;

        const artist = await userModel
            .findById(artistId)
            .select('-password')
            .populate('services')
            .populate('portfolio');

        if (!artist || artist.role !== 'artist') {
            return res.status(404).json({
                success: false,
                message: 'Artist not found'
            });
        }

        const reviews = await Review.find({ artistId }).populate('clientId', 'name email');

        const artistData = artist.toObject();
        artistData.reviews = reviews;

        return res.status(200).json({
            success: true,
            message: 'Artist profile fetched successfully',
            data: artistData
        });

    } catch (error) {
        console.error('Error fetching artist profile:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};