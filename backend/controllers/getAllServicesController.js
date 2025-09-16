const Service = require('../models/Service');

module.exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find()
            .populate('artist', 'name email')  // Populate artist name and email only

        return res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
};
