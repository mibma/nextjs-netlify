const cityModel = require('../models/cityModel');

// Get all cities
const getAllCities = async (req, res) => {
    try {
        const cities = await cityModel.getAllCities();
        res.json(cities);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get city by ID
const getCityByID = async (req, res) => {
    try {
        const city = await cityModel.getCityByID(req.params.id);
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.json(city);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get city by Name
const getCityByName = async (req, res) => {
    try {
        const city = await cityModel.getCityByName(req.params.name);
        if (!city) return res.status(404).json({ error: 'City not found' });
        res.json(city);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

const createCity = async (req, res) => {
    try {
        const { name, state_province, country, timezone } = req.body;

        // Check for missing fields
        if (!name || !state_province || !country || !timezone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Insert city into the database
        const newCity = await cityModel.createCity(name, state_province, country, timezone);

        res.status(201).json(newCity);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {
    getAllCities,
    getCityByID,
    getCityByName,
    createCity
};