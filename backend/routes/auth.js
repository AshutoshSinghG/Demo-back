const express = require('express')
const router = express.Router();
const { createUser, loginUser, logoutUser, getOwnProfile } = require('../controllers/authController')
const { isLogedIn } = require('../middlewares/isLogedIn')

router.post('/register', createUser) //create new User(client/Artist)

router.post('/login', loginUser) //login User(client/Artist)

router.get('/logout', isLogedIn, logoutUser) //logout User(client/Artist)

router.get('/profile', isLogedIn, getOwnProfile) //See own profile(client/Artist)

module.exports = router;