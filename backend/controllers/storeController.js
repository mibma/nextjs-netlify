const storeModel = require('../models/storeModel');

// Get all stores
const getAllStores = async (req, res) => {
    try {
        const stores = await storeModel.getAllStores();
        res.json(stores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get store by ID
const getStoreByID = async (req, res) => {
    try {
        const store = await storeModel.getStoreByID(req.params.id);
        if (!store) return res.status(404).json({ error: 'Store not found' });
        res.json(store);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get stores by City ID
const getStoresByCityID = async (req, res) => {
    try {
        const stores = await storeModel.getStoresByCityID(req.params.city_id);
        if (stores.length === 0) return res.status(404).json({ error: 'No stores found in this city' });
        res.json(stores);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new store
const createStore = async (req, res) => {
    try {
        const { name, location, city_id, postal_code, is_active } = req.body;

        if (!name || !city_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const newStore = await storeModel.createStore(name, location, city_id, postal_code, is_active);
        res.status(201).json(newStore);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllStores,
    getStoreByID,
    getStoresByCityID,
    createStore
};
