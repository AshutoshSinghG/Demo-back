const express = require('express');
const router = express.Router();
const { getArtistProfile } = require('../controllers/artistProfileController')
const { isLogedIn } = require('../middlewares/isLogedIn')

// Route to get artist profile by ID
router.get('/:id', isLogedIn, getArtistProfile);

module.exports = router;
