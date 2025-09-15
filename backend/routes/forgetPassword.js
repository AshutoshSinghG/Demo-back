const express = require('express');
const { forgotPassword, resetPassword } = require('../controllers/forgetPasswordController');

const router = express.Router();

router.post('/forget-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
