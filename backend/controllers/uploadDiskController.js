const PortfolioModel = require('../models/Portfolio');
const UserModel = require('../models/User');
module.exports.uploadImageDisk = async (req, res) => {
console.log("iddddddddddddiiiiiii:", req.user._id)
    const user = await UserModel.findById(req.user._id);
    const portfolio = await PortfolioModel.findById(user.portfolio);
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        portfolio.images.push(imageUrl);
        await portfolio.save();

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            imageUrl
        });
    } catch (error) {
        console.error('Image Upload Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
};
