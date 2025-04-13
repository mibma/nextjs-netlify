const storeInventoryModel = require('../models/storeInventoryModel');

// Get all inventory records
const getAllInventory = async (req, res) => {
    try {
        const inventory = await storeInventoryModel.getAllInventory();
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get inventory by Store ID
const getInventoryByStoreID = async (req, res) => {
    try {
        const inventory = await storeInventoryModel.getInventoryByStoreID(req.params.store_id);
        if (!inventory.length) return res.status(404).json({ error: 'No inventory found for this store' });
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get inventory by Product ID
const getInventoryByProductID = async (req, res) => {
    try {
        const inventory = await storeInventoryModel.getInventoryByProductID(req.params.product_id);
        if (!inventory.length) return res.status(404).json({ error: 'No inventory found for this product' });
        res.json(inventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new inventory record
const createInventoryRecord = async (req, res) => {
    try {
        const { store_id, product_id, current_quantity, reorder_level } = req.body;

        if (!store_id || !product_id) {
            return res.status(400).json({ error: 'Store ID and Product ID are required' });
        }

        const newRecord = await storeInventoryModel.createInventoryRecord(store_id, product_id, current_quantity, reorder_level);
        res.status(201).json(newRecord);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Update inventory quantity
const updateInventory = async (req, res) => {
    try {
        const { current_quantity, reorder_level } = req.body;
        const updatedInventory = await storeInventoryModel.updateInventory(req.params.inventory_id, current_quantity, reorder_level);

        if (!updatedInventory) return res.status(404).json({ error: 'Inventory record not found' });
        res.json(updatedInventory);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete an inventory record
const deleteInventory = async (req, res) => {
    try {
        const deleted = await storeInventoryModel.deleteInventory(req.params.inventory_id);
        if (!deleted) return res.status(404).json({ error: 'Inventory record not found' });
        res.json({ message: 'Inventory record deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllInventory,
    getInventoryByStoreID,
    getInventoryByProductID,
    createInventoryRecord,
    updateInventory,
    deleteInventory
};
