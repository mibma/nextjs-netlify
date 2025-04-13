const express = require('express');
const cityController = require('../controllers/cityController');

const router = express.Router();

// Get all cities
router.get('/getall', cityController.getAllCities);

// Get city by ID
router.get('/get/:id', cityController.getCityByID);

// Get city by name
router.get('/get/name/:name', cityController.getCityByName);

// Create new city
router.post('/createcity', cityController.createCity);

module.exports = router;