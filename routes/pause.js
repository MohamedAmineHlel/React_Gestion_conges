const express = require('express');
const router = express.Router();
const PauseController = require('../controllers/PauseController');

// Create new break (pause)
router.post('/', PauseController.createPause);

// Get all breaks (pauses)
router.get('/', PauseController.getPauses);

// Update break status (approve/reject)
router.put('/:id', PauseController.updatePause);

// Delete break
router.delete('/:id', PauseController.deletePause);

module.exports = router;
