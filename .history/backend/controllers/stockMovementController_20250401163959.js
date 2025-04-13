const stockMovementModel = require('../models/stockMovementModel');

// Get all stock movements
const getAllStockMovements = async (req, res) => {
    try {
        const movements = await stockMovementModel.getAllStockMovements();
        res.json(movements);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get stock movement by ID
const getStockMovementByID = async (req, res) => {
    try {
        const movement = await stockMovementModel.getStockMovementByID(req.params.id);
        if (!movement) return res.status(404).json({ error: 'Stock movement not found' });
        res.json(movement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new stock movement
const createStockMovement = async (req, res) => {
    try {
        const { store_id, product_id, quantity_change, movement_type, reference_id, source_store_id, destination_store_id, notes, created_by } = req.body;

        if (!store_id || !product_id || !quantity_change || !movement_type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newMovement = await stockMovementModel.createStockMovement(store_id, product_id, quantity_change, movement_type, reference_id, source_store_id, destination_store_id, notes, created_by);
        res.status(201).json(newMovement);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Delete stock movement
const deleteStockMovement = async (req, res) => {
    try {
        const deleted = await stockMovementModel.deleteStockMovement(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Stock movement not found' });
        res.json({ message: 'Stock movement deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllStockMovements,
    getStockMovementByID,
    createStockMovement,
    deleteStockMovement
};
