module.exports = (req, res, next) => {
    if (req.user && req.user.isVerified) {
        return next();
    }
    return res.status(403).json({ success: false, message: 'Please verify your email to proceed.' });
};
