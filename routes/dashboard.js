const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Conge = require('../models/Conge');
const Timesheet = require('../models/Timesheet');

// Dashboard Route
router.get('/', async (req, res) => {
    try {
        // Count employees and managers
        const employeesCount = await User.countDocuments({ role: 'employee' });
        const managersCount = await User.countDocuments({ role: 'manager' });

        // Count leave requests (accepted, rejected, pending)
        const leaveCounts = await Conge.aggregate([
            {
                $group: {
                    _id: "$etat",
                    count: { $sum: 1 }
                }
            }
        ]);
        const leaveStatus = {
            accepter: 0,
            refuser: 0,
            attend: 0,
        };
        leaveCounts.forEach(item => {
            leaveStatus[item._id] = item.count;
        });

        // Count timesheets (approved, rejected, pending)
        const timesheetCounts = await Timesheet.aggregate([
            {
                $group: {
                    _id: "$etat",
                    count: { $sum: 1 }
                }
            }
        ]);
        const timesheetStatus = {
            accepter: 0,
            refuser: 0,
            attend: 0,
        };
        timesheetCounts.forEach(item => {
            timesheetStatus[item._id] = item.count;
        });

        // Send the dashboard data
        res.json({
            employeesCount,
            managersCount,
            leaveStatus,
            timesheetStatus,
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
