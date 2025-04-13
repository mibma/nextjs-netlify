const pool = require('../db');

// Get all stock movements
const getAllStockMovements = async () => {
    const { rows } = await pool.query('SELECT * FROM stock_movements ORDER BY created_at DESC');
    return rows;
};

// Get stock movement by ID
const getStockMovementByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM stock_movements WHERE movement_id = $1', [id]);
    return rows[0];
};

// Create a new stock movement
const createStockMovement = async (store_id, product_id, quantity_change, movement_type, reference_id, source_store_id, destination_store_id, notes, created_by) => {
    const { rows } = await pool.query(
        `INSERT INTO stock_movements (store_id, product_id, quantity_change, movement_type, reference_id, source_store_id, destination_store_id, notes, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [store_id, product_id, quantity_change, movement_type, reference_id, source_store_id, destination_store_id, notes, created_by]
    );
    return rows[0];
};

// Delete stock movement
const deleteStockMovement = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM stock_movements WHERE movement_id = $1', [id]);
    return rowCount > 0;
};

module.exports = {
    getAllStockMovements,
    getStockMovementByID,
    createStockMovement,
    deleteStockMovement
};
