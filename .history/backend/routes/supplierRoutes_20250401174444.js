const express = require('express');
const supplierController = require('../controllers/supplierController');

const router = express.Router();

// Get all suppliers
router.get('/getall', supplierController.getAllSuppliers);

// Get supplier by ID
router.get('/get/:id', supplierController.getSupplierByID);

// Get suppliers by city ID
router.get('/get/city/:city_id', supplierController.getSuppliersByCityID);

// Create a new supplier
router.post('/createsupplier', supplierController.createSupplier);

module.exports = router;
