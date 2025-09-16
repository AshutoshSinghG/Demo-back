const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerDiskStorage');
const { uploadImageDisk } = require('../controllers/uploadDiskController');

// POST /api/upload/disk-image
router.post('/disk-image', upload.single('image'), uploadImageDisk);

module.exports = router;
