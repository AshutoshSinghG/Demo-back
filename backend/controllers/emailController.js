const jwt = require('jsonwebtoken');
const userModel = require('../models/User');
const { sendWelcomeEmail } = require('../utils/mailer')

module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_EMAIL_VERIFY);

        const user = await userModel.findById(decoded.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isVerified = true;
        await user.save();

        // Send Welcome Email after verification
        await sendWelcomeEmail(user);

        return res.status(200).json({ success: true, message: 'Email verified successfully.' });

    } catch (error) {
        console.error('Email verification error:', error.message);
        return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }
};
