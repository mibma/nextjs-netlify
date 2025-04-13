const productModel = require('../models/productModel');

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await productModel.getAllProducts();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get product by ID
const getProductByID = async (req, res) => {
    try {
        const product = await productModel.getProductByID(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get product by Barcode
const getProductByBarcode = async (req, res) => {
    try {
        const product = await productModel.getProductByBarcode(req.params.barcode);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new product
const createProduct = async (req, res) => {
    try {
        const { name, description, barcode, category, unit_price } = req.body;

        if (!name || !unit_price) {
            return res.status(400).json({ error: 'Name and unit price are required' });
        }

        const newProduct = await productModel.createProduct(name, description, barcode, category, unit_price);
        res.status(201).json(newProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    try {
        const { name, description, barcode, category, unit_price } = req.body;
        const updatedProduct = await productModel.updateProduct(req.params.id, name, description, barcode, category, unit_price);

        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });
        res.json(updatedProduct);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const deleted = await productModel.deleteProduct(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllProducts,
    getProductByID,
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct
};
