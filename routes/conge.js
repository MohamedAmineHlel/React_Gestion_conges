const express = require('express');
const router = express.Router();
const CongeController = require('../controllers/CongeController');
const authenticateToken = require('../middleware/authenticate'); 
// Create new leave (congé)
router.post('/', authenticateToken,CongeController.createConge);

// Get all leaves
router.get('/',authenticateToken ,CongeController.getConges);
// Get all Employee leaves
router.get('/emp',authenticateToken ,CongeController.getCongesEmployer);
// Get  leaves by id
router.get('/:id' ,CongeController.getCongesByid);
//Get Conge attendees
router.get('/attend',authenticateToken, CongeController.getCongesAttendees);

// Update leave status (approve/reject)
router.put('/:id', CongeController.updateCongemanager);

// Delete leave
router.delete('/:id',CongeController.deleteConge);
// Route to get Conge details by actorId and createdAt
router.get('/congedetail/:actorId/:createdAt', CongeController.getCongeByActorAndDate);

// Route to update Conge (modify start date, end date, and status)
router.put('/congedetail/:actorId/:createdAt', CongeController.updateConge);

// get Conge by actorId
router.get('/congeuser/:actorId',CongeController.getCongeuser);
// Route to get leave dashboard data
router.get('/dashboard/:id', CongeController.getLeaveDashboardData);
module.exports = router;
