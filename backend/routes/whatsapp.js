const express = require('express');
const router = express.Router();
const { isLogedIn } = require('../middlewares/isLogedIn')
const { sendMessageController } = require('../controllers/whatsappMassegeController')


router.get('/', isLogedIn, sendMessageController)

module.exports = router;