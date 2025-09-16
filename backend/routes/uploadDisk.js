const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerDiskStorage');
const { uploadImageDisk } = require('../controllers/uploadDiskController');
const { isLogedIn } = require('../middlewares/isLogedIn');

// POST /api/upload/disk-image
router.post('/image', isLogedIn, upload.single('image'), uploadImageDisk);

module.exports = router;
