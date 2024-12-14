const Timesheet = require('../models/Timesheet');

// Create a new timesheet
exports.createTimesheet1 = async (req, res) => {
    try {
        const timesheet = new Timesheet(req.body);
        await timesheet.save();
        res.status(201).json(timesheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Create a new timesheet createTimesheet
exports.createTimesheet = async (req, res) => {
    try {
        const { idEmployee, idManager, etat, description, jours } = req.body;

        const timesheet = new Timesheet({
            idEmployee,
            idManager,
            etat,
            description,
            jours
        });

        await timesheet.save();
        res.status(201).json({ message: 'Timesheet created successfully', timesheet });
    } catch (error) {
        console.error('Error creating timesheet:', error);
        res.status(500).json({ error: 'Failed to create timesheet' });
    }
};
exports.getTimesheetsAttendees = async (req, res) => {
    try {
        const pendingTimesheets = await Timesheet.find({ status: 'pending' });
        res.status(200).json(pendingTimesheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all timesheets
exports.getAllTimesheets = async (req, res) => {
    try {
        const timesheets = await Timesheet.find().populate('idEmployee', 'username').populate('idManager', 'username');
        res.status(200).json(timesheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all timesheetsEmployee
exports.getAllTimesheetsEmployee = async (req, res) => {
    try {
        // Filtrer les timesheets où idEmployee a le rôle 'employee'
        const timesheets = await Timesheet.find()
            .populate({
                path: 'idEmployee', // Charger les informations de l'employé
                select: 'username role', // Inclure uniquement 'username' et 'role'
                match: { role: 'employee' } // Filtrer les employés ayant le rôle 'employee'
            })
            .populate('idManager', 'username'); // Charger les informations du manager

        // Filtrer les timesheets pour lesquelles idEmployee existe (après le match)
        const filteredTimesheets = timesheets.filter((timesheet) => timesheet.idEmployee);

        res.status(200).json(filteredTimesheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllTimesheetsManeger = async (req, res) => {
    try {
        // Filtrer les timesheets où idEmployee a le rôle 'employee'
        const timesheets = await Timesheet.find()
            .populate({
                path: 'idEmployee', // Charger les informations de l'employé
                select: 'username role', // Inclure uniquement 'username' et 'role'
                match: { role: 'maneger' } // Filtrer les employés ayant le rôle 'employee'
            })
            .populate('idManager', 'username'); // Charger les informations du manager

        // Filtrer les timesheets pour lesquelles idEmployee existe (après le match)
        const filteredTimesheets = timesheets.filter((timesheet) => timesheet.idEmployee);

        res.status(200).json(filteredTimesheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get timesheets by employee ID
exports.getTimesheetsByEmployee = async (req, res) => {
    try {
        const  idEmployee  = req.params.employeeId;
        console.log(idEmployee);
        const timesheets = await Timesheet.findOne({ idEmployee:idEmployee }).populate('idEmployee', 'username').populate('idManager', 'username');
        res.status(200).json(timesheets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single timesheet by ID
exports.getTimesheetById = async (req, res) => {
    try {
        const timesheet = await Timesheet.findById(req.params.id).populate('idEmployee', 'username').populate('idManager', 'username');
        if (!timesheet) return res.status(404).json({ message: 'Timesheet not found' });
        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a timesheet by ID
exports.updateTimesheet = async (req, res) => {
    try {
        console.log(req.body)
        const updatedTimesheet = await Timesheet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTimesheet) return res.status(404).json({ message: 'Timesheet not found' });
        res.status(200).json(updatedTimesheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve a timesheet
exports.approveTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvedBy } = req.body;  // Assume the HR admin's user ID is passed in

        const timesheet = await Timesheet.findById(id);
        if (!timesheet) return res.status(404).json({ message: 'Timesheet not found' });

        timesheet.etat = 'accepter';
        timesheet.idManager = approvedBy;
        await timesheet.save();

        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
// Approve a timesheet
exports.changeEtatTimesheet = async (req, res) => {
    try {
        const { id } = req.params;
        const { approvedBy, etat } = req.body;  // Assume the HR admin's user ID is passed in

        const timesheet = await Timesheet.findById(id);
        if (!timesheet) return res.status(404).json({ message: 'Timesheet not found' });

        timesheet.etat = etat;
        timesheet.idManager = approvedBy;
        await timesheet.save();

        res.status(200).json(timesheet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}; 
