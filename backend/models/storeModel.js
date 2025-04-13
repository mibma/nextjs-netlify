const pool = require('../db');

// Get all stores
const getAllStores = async () => {
    const { rows } = await pool.query('SELECT * FROM stores');
    return rows;
};

// Get store by ID
const getStoreByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM stores WHERE store_id = $1', [id]);
    return rows[0];
};

// Get stores by City ID
const getStoresByCityID = async (city_id) => {
    const { rows } = await pool.query('SELECT * FROM stores WHERE city_id = $1', [city_id]);
    return rows;
};

// Create a new store
const createStore = async (name, location, city_id, postal_code, is_active = true) => {
    const { rows } = await pool.query(
        `INSERT INTO stores (name, location, city_id, postal_code, is_active)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, location, city_id, postal_code, is_active]
    );
    return rows[0];
};

module.exports = {
    getAllStores,
    getStoreByID,
    getStoresByCityID,
    createStore
};
