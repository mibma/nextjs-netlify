const express = require('express');
const storeInventoryController = require('../controllers/storeInventoryController');

const router = express.Router();

// Get all inventory records
router.get('/getall', storeInventoryController.getAllInventory);

// Get inventory by store ID
router.get('/get/store/:store_id', storeInventoryController.getInventoryByStoreID);

// Get inventory by product ID
router.get('/get/product/:product_id', storeInventoryController.getInventoryByProductID);

// Create new inventory record
router.post('/create', storeInventoryController.createInventoryRecord);

// Update inventory quantity
router.put('/update/:inventory_id', storeInventoryController.updateInventory);

// Delete an inventory record
router.delete('/delete/:inventory_id', storeInventoryController.deleteInventory);

module.exports = router;
