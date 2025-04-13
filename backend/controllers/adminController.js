const adminModel = require('../models/adminModel');

// Get all admins
const getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.json(admins);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get admin by ID
const getAdminByID = async (req, res) => {
    try {
        const admin = await adminModel.getAdminByID(req.params.id);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Get admin by Email
const getAdminByEmail = async (req, res) => {
    try {
        const admin = await adminModel.getAdminByEmail(req.params.email);
        if (!admin) return res.status(404).json({ error: 'Admin not found' });
        res.json(admin);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

// Create a new admin
const createAdmin = async (req, res) => {
    try {
        const { email, name, password, role } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash the password (for security)
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newAdmin = await adminModel.createAdmin(email, name, passwordHash, role);
        res.status(201).json(newAdmin);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllAdmins,
    getAdminByID,
    getAdminByEmail,
    createAdmin
};
