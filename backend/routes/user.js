const express = require('express')
const router = express.Router();
const { createService, createPortfolio, deleteService, updateService, deletePortfolio, updatePortfolio } = require('../controllers/userController')
const { isLogedIn } = require('../middlewares/isLogedIn')

router.post('/createService', isLogedIn, createService) // create new service

router.post('/createPortfolio', isLogedIn, createPortfolio) // create new portfolii

router.post('/service/edit/:id', isLogedIn, updateService) // update Service

router.post('/service/delete/:id', isLogedIn, deleteService) //delete service

router.post('/portfolio/edit/:id', isLogedIn, updatePortfolio) //update portofolio

router.post('/portfolio/delete/:id', isLogedIn, deletePortfolio) //delete portofolio


module.exports = router;