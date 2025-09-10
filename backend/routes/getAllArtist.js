const express = require('express');
const router = express.Router();
const { getAllArtists } = require('../controllers/getAllArtistController')
const { isLogedIn } = require('../middlewares/isLogedIn')

// Route to get artist profile by ID
router.get('/', isLogedIn, getAllArtists);

module.exports = router;
