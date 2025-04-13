const supplierModel = require('../models/supplierModel');

// Get all suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await supplierModel.getAllSuppliers();
        res.json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get supplier by ID
const getSupplierByID = async (req, res) => {
    try {
        const supplier = await supplierModel.getSupplierByID(req.params.id);
        if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
        res.json(supplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get suppliers by City ID
const getSuppliersByCityID = async (req, res) => {
    try {
        const suppliers = await supplierModel.getSuppliersByCityID(req.params.city_id);
        if (suppliers.length === 0) return res.status(404).json({ error: 'No suppliers found in this city' });
        res.json(suppliers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new supplier
const createSupplier = async (req, res) => {
    try {
        const { name, contact_email, phone, address, city_id, tax_id } = req.body;

        if (!name || !city_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newSupplier = await supplierModel.createSupplier(name, contact_email, phone, address, city_id, tax_id);
        res.status(201).json(newSupplier);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllSuppliers,
    getSupplierByID,
    getSuppliersByCityID,
    createSupplier
};
