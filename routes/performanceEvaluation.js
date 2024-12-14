const express = require('express');
const router = express.Router();
const performanceEvaluationController = require('../controllers/performanceEvaluationController');

// Create a new performance evaluation
router.post('/', performanceEvaluationController.createEvaluation);

// Get all performance evaluations
router.get('/', performanceEvaluationController.getAllEvaluations);
// Route for getting evaluation
router.get('/:employeeId/:managerId', performanceEvaluationController.getEvaluationsByEmployeeManeger);

// Get evaluations by employee ID
router.get('/:employeeId', performanceEvaluationController.getEvaluationsByEmployee);

// Update an evaluation
router.put('/:id', performanceEvaluationController.updateEvaluation);

// Delete an evaluation
router.delete('/:id', performanceEvaluationController.deleteEvaluation);

module.exports = router;
