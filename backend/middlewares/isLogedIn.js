const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

module.exports.isLogedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token is missing. Please login first.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);

        const user = await userModel.findOne({ email: decoded.email }).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Authentication failed.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please login again.'
        });
    }
};
