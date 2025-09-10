const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');
const { isLogedIn } = require('../middlewares/isLogedIn');


router.post('/send/:id', isLogedIn, sendMessage); // Send massage bidirectional (client to artist, artist to client)

module.exports = router;
