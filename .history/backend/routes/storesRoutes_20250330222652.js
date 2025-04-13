const express = require('express');
const storeController = require('../controllers/storeController');

const router = express.Router();

// Get all stores
router.get('/getall', storeController.getAllStores);

// Get store by ID
router.get('/get/:id', storeController.getStoreByID);

// Get stores by city ID
router.get('/get/city/:city_id', storeController.getStoresByCityID);

// Create a new store
router.post('/createstore', storeController.createStore);

module.exports = router;
