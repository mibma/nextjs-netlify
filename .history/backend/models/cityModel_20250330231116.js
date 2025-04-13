const pool = require('../db');

// Get all cities
const getAllCities = async () => {
    const { rows } = await pool.query('SELECT * FROM cities');
    return rows;
};

// Get city by ID
const getCityByID = async (id) => {
    const { rows } = await pool.query('SELECT * FROM cities WHERE id = $1', [id]);
    return rows[0];
};

// Get city by Name
const getCityByName = async (name) => {
    const { rows } = await pool.query('SELECT * FROM cities WHERE name = $1', [name]);
    return rows[0];
};

// Create a new city
const createCity = async (name, state, country) => {
    const { rows } = await pool.query(
        `INSERT INTO cities (name, state_province, country)
         VALUES ($1, $2, $3) RETURNING *`,
        [name, state, country]
    );
    return rows[0];
};

module.exports = {
    getAllCities,
    getCityByID,
    getCityByName,
    createCity
};