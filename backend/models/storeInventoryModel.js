const pool = require('../db');

// Get all inventory records
const getAllInventory = async () => {
    const { rows } = await pool.query('SELECT * FROM store_inventory');
    return rows;
};

// Get inventory by Store ID
const getInventoryByStoreID = async (store_id) => {
    const { rows } = await pool.query('SELECT * FROM store_inventory WHERE store_id = $1', [store_id]);
    return rows;
};

// Get inventory by Product ID
const getInventoryByProductID = async (product_id) => {
    const { rows } = await pool.query('SELECT * FROM store_inventory WHERE product_id = $1', [product_id]);
    return rows;
};

// Create a new inventory record
const createInventoryRecord = async (store_id, product_id, current_quantity = 0, reorder_level = 0) => {
    const { rows } = await pool.query(
        `INSERT INTO store_inventory (store_id, product_id, current_quantity, reorder_level)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [store_id, product_id, current_quantity, reorder_level]
    );
    return rows[0];
};

// Update inventory quantity
const updateInventory = async (inventory_id, current_quantity, reorder_level) => {
    const { rows } = await pool.query(
        `UPDATE store_inventory
         SET current_quantity = $1, reorder_level = $2, last_updated = NOW()
         WHERE inventory_id = $3 RETURNING *`,
        [current_quantity, reorder_level, inventory_id]
    );
    return rows[0];
};

// Delete an inventory record
const deleteInventory = async (inventory_id) => {
    const { rowCount } = await pool.query('DELETE FROM store_inventory WHERE inventory_id = $1', [inventory_id]);
    return rowCount > 0;
};

module.exports = {
    getAllInventory,
    getInventoryByStoreID,
    getInventoryByProductID,
    createInventoryRecord,
    updateInventory,
    deleteInventory
};
