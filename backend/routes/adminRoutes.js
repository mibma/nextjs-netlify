const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware'); // Basic Auth
const apiLimiter = require('../middleware/rateLimiter'); // Rate Limiting

const router = express.Router();
// Apply middleware
router.use(authMiddleware); // All routes require authentication
router.use(apiLimiter); // Rate limiting applied

// Get all admins
router.get('/getall', adminController.getAllAdmins);

// Get admin by ID
router.get('/get/:id', adminController.getAdminByID);

// Get admin by email
router.get('/get/email/:email', adminController.getAdminByEmail);

// Create new admin
router.post('/createadmin', adminController.createAdmin);

module.exports = router;
