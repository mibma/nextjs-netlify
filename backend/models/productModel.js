const pool = require('../db');

// Get all products
const getAllProducts = async () => {
    const { rows } = await pool.query('SELECT * FROM products');
    return rows;
};

// Get product by ID
const getProductByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);
    return rows[0];
};

// Get product by barcode
const getProductByBarcode = async (barcode) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE barcode = $1', [barcode]);
    return rows[0];
};

// Create a new product
const createProduct = async (name, description, barcode, category, unit_price) => {
    const { rows } = await pool.query(
        `INSERT INTO products (name, description, barcode, category, unit_price)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, description, barcode, category, unit_price]
    );
    return rows[0];
};

// Update a product
const updateProduct = async (id, name, description, barcode, category, unit_price) => {
    const { rows } = await pool.query(
        `UPDATE products
         SET name = $1, description = $2, barcode = $3, category = $4, unit_price = $5, updated_at = NOW()
         WHERE product_id = $6 RETURNING *`,
        [name, description, barcode, category, unit_price, id]
    );
    return rows[0];
};

// Delete a product
const deleteProduct = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM products WHERE product_id = $1', [id]);
    return rowCount > 0;
};

module.exports = {
    getAllProducts,
    getProductByID,
    getProductByBarcode,
    createProduct,
    updateProduct,
    deleteProduct
};
