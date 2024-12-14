// routes/detailuser.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticate'); 
const authorizeRoles = require('../middleware/authorizeRoles');

const DetailUserController = require('../controllers/DetailUserController');


// Define routes for detailuser
router.post('/',authenticateToken, DetailUserController.createDetailUser);   // Create new details
router.get('/:id',authenticateToken, DetailUserController.getUserDetail);       // Get details by user ID


// router.put('/dfrg/:id',authenticateToken, DetailUserController.updateUserDetail);    Update details
router.put('/:id', authenticateToken,authorizeRoles(['manager', 'admin']), DetailUserController.updateDetailByUserId);// Update detail by userId
router.delete('/:id',authenticateToken, DetailUserController.deleteUserDetail); // Delete details
// Route to get DetailUser by email (through User's email)
router.get('/finddetailbyemail/:email',authenticateToken, DetailUserController.findDetailUserByEmail);
// Route to adjust leave days for a user when leave is approved
router.put('/updateleavedays/:id', authenticateToken, DetailUserController.adjustLeaveDays);


module.exports = router;
