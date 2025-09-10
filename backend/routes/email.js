const express = require('express');
const router = express.Router();
const { verifyEmail } = require('../controllers/emailController');

// Verify email (clicked link)
router.get('/verify/:token', verifyEmail);

module.exports = router;
