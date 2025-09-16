require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const path = require('path');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const artistProfile = require('./routes/artistProfile');
const reviewRoutes = require('./routes/review');
const messageRoutes = require('./routes/message');
const connectDB = require('./config/mongoose-connection');
const getAllArtists = require('./routes/getAllArtist');
const emailRoutes = require('./routes/email');
const forgotPasswordRoute = require('./routes/forgetPassword')
const whatsappRoutes = require('./routes/whatsapp');
const uploadDiskRoutes = require('./routes/uploadDisk');
const getServicesRoutes = require('./routes/getAllServices');

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());

app.use(session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 5 * 24 * 60 * 60 * 1000
    }
}));
app.use(flash());


// Health Check Endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is healthy' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', forgotPasswordRoute)
app.use('/getAllArtist', getAllArtists)  //for show all artist profile card at home page
app.use('/artist', artistProfile) // user/client see artist profile
app.use('/reviews', reviewRoutes);
app.use('/messages', messageRoutes); //Bi-Directional Massages
app.use('/email', emailRoutes);  //Send verification Email
app.use('/book', whatsappRoutes) //Booking through Whatsapp
app.use('/api/upload', uploadDiskRoutes); // upload image
app.use('/services', getServicesRoutes); //show All Services

app.get('/', (req, res) => {
    return res.status(201).json({
        success: true,
        message: "Backend is Working",
    });
})

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
