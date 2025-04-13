const pool = require('../db');

// Get all active suppliers
const getAllSuppliers = async () => {
    const { rows } = await pool.query('SELECT * FROM suppliers WHERE is_active = TRUE');
    return rows;
};

// Get supplier by ID
const getSupplierByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM suppliers WHERE supplier_id = $1', [id]);
    return rows[0];
};

// Get suppliers by City ID
const getSuppliersByCityID = async (city_id) => {
    const { rows } = await pool.query('SELECT * FROM suppliers WHERE city_id = $1', [city_id]);
    return rows;
};

// Create a new supplier
const createSupplier = async (name, contact_email, phone, address, city_id, tax_id) => {
    const { rows } = await pool.query(
        `INSERT INTO suppliers (name, contact_email, phone, address, city_id, tax_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [name, contact_email, phone, address, city_id, tax_id]
    );
    return rows[0];
};

module.exports = {
    getAllSuppliers,
    getSupplierByID,
    getSuppliersByCityID,
    createSupplier
};
