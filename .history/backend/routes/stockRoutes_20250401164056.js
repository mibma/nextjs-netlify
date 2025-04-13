const express = require('express');
const stockMovementController = require('../controllers/stockMovementController');

const router = express.Router();

// Get all stock movements
router.get('/getall', stockMovementController.getAllStockMovements);

// Get stock movement by ID
router.get('/get/:id', stockMovementController.getStockMovementByID);

// Create new stock movement
router.post('/create', stockMovementController.createStockMovement);

// Delete stock movement
router.delete('/delete/:id', stockMovementController.deleteStockMovement);

module.exports = router;
