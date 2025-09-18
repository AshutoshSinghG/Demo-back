const userModel = require('../models/User');
const { sendForgotPasswordEmail, afterResetPasswordEmail } = require('../utils/mailer');
const { generateRandomToken } = require('../utils/generateToken');
const bcrypt = require('bcrypt');

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const resetToken = generateRandomToken(24);

        user.resetPaswordToken = resetToken;
        await user.save();
        await sendForgotPasswordEmail(user, resetToken);
        return res.status(200).json({ success: true, message: 'Password reset email sent' });

    } catch (error) {
        console.error('Error sending password reset email:', error.message);
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await userModel.findOne({resetPaswordToken: token});
        console.log(user)
        if (!user) {
            return res.status(404).json({ success: false, message: 'Invalid token or user not found' });
        }
        bcrypt.genSalt(12, (error, salt) => {
            bcrypt.hash(newPassword, salt, async (error, hash) => {
                user.password = hash;
                user.resetPaswordToken = null;
                await user.save();
            })
        })
        await afterResetPasswordEmail(user);
        return res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }
};
