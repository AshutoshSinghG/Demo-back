const userModel = require('../models/User')
const Service = require('../models/Service');
const Review = require('../models/Review');
const Portfolio = require('../models/Portfolio');
const Message = require('../models/Message');
const bcrypt = require('bcrypt');
const { generateToken, generateRandomToken } = require('../utils/generateToken')
const { sendVerificationEmail } = require('../utils/mailer');

//Create New user
module.exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        // Email already exists check
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const verifyToken = generateRandomToken(24);
        // Password hash
        bcrypt.genSalt(12, (error, salt) => {
            bcrypt.hash(password, salt, async (error, hash) => {

                // New user
                try {
                    const newUser = new userModel({
                        name,
                        email,
                        password: hash,
                        role,
                        VerificationEmailToken: verifyToken
                    })

                    

                    // Send verification email (e.g., after user signup)
                    await sendVerificationEmail(email, verifyToken);
                    await newUser.save()

                    return res.status(201).json({
                        success: true,
                        message: "User registered successfully, Please verify your email to login",
                    });
                }
                catch (error) {
                    console.error("Error in register:", error);
                    return res.status(500).json({ success: false, message: "Server error", error: error.message });
                }
            })
        })


    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

//User Login
module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }

        // User check
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // verifiedUser check
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in.'
            });
        }

        // Password check
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // JWT Token generate
        let token = generateToken(user)
        res.cookie("token", token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.error("Error in login:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// Get User Profile
module.exports.getOwnProfile = async (req, res) => {
    try {
        const userId = req.user._id;  // Authenticated user id from middleware

        const user = await userModel.findById(userId).select('-password').lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        let extraData = {};

        if (user.role === 'artist') {
            // Populate services, portfolio, reviews, messages
            const services = await Service.find({ artist: userId }).lean();
            const portfolio = await Portfolio.findOne({ artist: userId }).lean();
            const reviews = await Review.find({ artistId: userId }).populate('clientId', 'name email').lean();
            const messages = await Message.find({
                $or: [
                    { ArtistId: userId },
                    { ClientId: userId }
                ]
            })
                .populate('ClientId', 'name email')
                .populate('ArtistId', 'name email')
                .lean();

            extraData = { services, portfolio, reviews, messages };
        }

        return res.status(200).json({
            success: true,
            message: 'User profile fetched successfully',
            data: {
                ...user,
                ...extraData
            }
        });

    } catch (error) {
        console.error('Error fetching own profile:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// Logout user
module.exports.logoutUser = (req, res) => {
    try {
        res.clearCookie('token');

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during logout'
        });
    }
};


