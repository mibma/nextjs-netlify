const pool = require('../db');

// Get all admins
const getAllAdmins = async () => {
    const { rows } = await pool.query('SELECT * FROM admin_users');
    return rows;
};

// Get admin by ID
const getAdminByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE id = $1', [id]);
    return rows[0];
};

// Get admin by Email
const getAdminByEmail = async (email) => {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email]);
    return rows[0];
};

// Create a new admin
const createAdmin = async (email, name, passwordHash, role = 'viewer') => {
    const { rows } = await pool.query(
        `INSERT INTO admin_users (email, name, password_hash, role)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [email, name, passwordHash, role]
    );
    return rows[0];
};

module.exports = {
    getAllAdmins,
    getAdminByID,
    getAdminByEmail,
    createAdmin
};
