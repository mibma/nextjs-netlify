const basicAuth = require('express-basic-auth');

const users = { admin: 'password123', viewer: 'viewerpass' }; // Change these

const authMiddleware = basicAuth({
    users,
    challenge: true, // Sends a 401 if authentication fails
    unauthorizedResponse: 'Unauthorized access',
});

module.exports = authMiddleware;
