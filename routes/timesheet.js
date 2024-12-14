const express = require('express');
const router = express.Router();
const timesheetController = require('../controllers/timesheetController');

// Create a new timesheet
router.post('/', timesheetController.createTimesheet);

// Get all timesheets
router.get('/', timesheetController.getAllTimesheets);
// Get all timesheets Employee
router.get('/employee', timesheetController.getAllTimesheetsEmployee);
// Get timesheets by employee ID
router.get('/employee/:employeeId', timesheetController.getTimesheetsByEmployee);

//Get timesheets attendees
router.get('/attend', timesheetController.getTimesheetsAttendees);
// Get a single timesheet by ID
router.get('/:id', timesheetController.getTimesheetById);

// Update a timesheet by ID
router.put('/:id', timesheetController.updateTimesheet);

// Approve a timesheet
router.put('/:id/approve', timesheetController.approveTimesheet);
//changeEtatTimesheet
router.put('/:id/changeEtat', timesheetController.approveTimesheet);

module.exports = router;
