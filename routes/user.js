const express = require('express');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authenticateToken = require('../middleware/authenticate'); // Middleware to protect routes
const router = express.Router();
const userController = require('../controllers/userController');

// Get all users
router.get('/',authenticateToken, userController.getAllUsers);
router.get('/managers',authenticateToken, userController.getAllManagers);

// Get a single user by ID
router.get('/:id',authenticateToken, userController.getUserById);
//get all maneger
// Create a new user (if needed)
router.post('/',authenticateToken, userController.createUser);

// Update a user by ID
router.put('/:id',authenticateToken, userController.updateUser);
// Update a user by email
router.put('/UpdateByEmail/:email', authenticateToken, userController.updateUserByEmail);
// Delete a user by ID
router.delete('/:id',authenticateToken, userController.deleteUser);
// Route to get User by email 
router.get('/findbyemail/:email', userController.findUserByEmail);
//update user password by maneger or admin
router.put('/:id/update-password', authenticateToken, userController.updateUserPassword);


module.exports = router;
