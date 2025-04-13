const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Get all products
router.get('/getall', productController.getAllProducts);

// Get product by ID
router.get('/get/:id', productController.getProductByID);

// Get product by barcode
router.get('/get/barcode/:barcode', productController.getProductByBarcode);

// Create a new product
router.post('/create', productController.createProduct);

// Update product details
router.put('/update/:id', productController.updateProduct);

// Delete a product
router.delete('/delete/:id', productController.deleteProduct);

module.exports = router;
