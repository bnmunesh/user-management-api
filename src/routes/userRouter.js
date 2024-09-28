const express = require('express');
const userController = require('../controllers/userController.js');
const authenticateJWT = require('../middleware/jwtAuthenticationFilter.js');

const router = express.Router();

// Public route (no authentication required)
router.post('/login', userController.loginUser);
router.post('/users', userController.createUser);

// Protected routes (authentication required)
router.get('/users', authenticateJWT, userController.getAllUsers);
router.get('/users/:userId', authenticateJWT, userController.getUserById);
router.put('/users/:userId', authenticateJWT, userController.updateUser);
router.delete('/users/:userId', authenticateJWT, userController.softDeleteUser);
router.delete('/users/:userId/force', authenticateJWT, userController.forceDeleteUser);

module.exports = router;