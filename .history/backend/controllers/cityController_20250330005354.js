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

// Create a new city
const createCity = async (req, res) => {
    try {
        const { name, population, country } = req.body;

        if (!name || !population || !country) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newCity = await cityModel.createCity(name, population, country);
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