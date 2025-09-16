const express = require('express');
const router = express.Router();
const { getAllServices } = require('../controllers/getAllServicesController');

// Public Route to fetch all services
router.get('/all', getAllServices);

module.exports = router;
