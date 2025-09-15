const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../controllers/emailController');
const { sendVerificationEmail } = require('../utils/mailer');
const { generateRandomToken } = require('../utils/generateToken');
const userModel = require('../models/User');

// Verify email (clicked link)
router.get('/verify/:token', verifyEmail);

//Resend Verify email (clicked link)
router.get('/resend-verify', async (req, res) => {
    try {
        const email = req.body.email;

        // Validation
        if (!email) {
            return res.status(400).json({ success: false, message: "Please enter registered email" });
        }

        // Email already exists check
        const existingUser = await userModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ success: false, message: "This Email is not registered" });
        }
        else{
            const token = generateRandomToken(24);
            existingUser.VerificationEmailToken = token;
            await existingUser.save();
            await sendVerificationEmail(email, token);
            return res.status(200).json({ success: true, message: "Email verification link is sent" });
        }
    } catch(error){
        return res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
