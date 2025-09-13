const express = require('express');
const router = express.Router();
const { getAllArtists } = require('../controllers/getAllArtistController')

// Route to get artist profile by ID
router.get('/', getAllArtists);

module.exports = router;
