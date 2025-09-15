const userModel = require('../models/User');
const { sendWelcomeEmail } = require('../utils/mailer')

module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await userModel.findOne({VerificationEmailToken: token});
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isVerified = true;
        user.VerificationEmailToken = null;
        await user.save();

        // Send Welcome Email after verification
        await sendWelcomeEmail(user);

        return res.status(200).json({ success: true, message: 'Email verified successfully.' });

    } catch (error) {
        console.error('Email verification error:', error.message);
        return res.status(400).json({ success: false, message: 'Invalid or expired token.' });
    }
};
