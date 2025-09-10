const express = require('express');
const router = express.Router();
const { createReview } = require('../controllers/reviewController');
const { isLogedIn } = require('../middlewares/isLogedIn');


router.post('/:artistId', isLogedIn, createReview); // post one review by client/user to artist only (not artist to user)

module.exports = router;
