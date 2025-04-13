const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Get all admins
router.get('/getall', adminController.getAllAdmins);

// Get admin by ID
router.get('/get/:id', adminController.getAdminByID);

// Get admin by email
router.get('/get/email/:email', adminController.getAdminByEmail);

// Create new admin
router.post('/createadmin', adminController.createAdmin);

module.exports = router;
