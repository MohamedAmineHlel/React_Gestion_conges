const PerformanceEvaluation = require('../models/PerformanceEvaluation');
const nodemailer = require('nodemailer');
const User = require('../models/user');  
const Notification = require('../models/Notification');
const sendEmail = async (toEmail, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mohamedhlel321@gmail.com', // your email
            pass: 'gjhz fkwo fglw osgd', // your email password or app password
        },
    });

    const mailOptions = {
        from: 'mohamedhlel321@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Create a new performance evaluation
exports.createEvaluation = async (req, res) => {
    try {
        const evaluation = new PerformanceEvaluation(req.body);
        evaluation.score=50;
        evaluation.feedback="good feedback";
        await evaluation.save();
         // Find the employee and send email
         if (req.body.employeeId){
            const employee = await User.findById(req.body.employeeId);
            if (employee) {
                // Send email to the employee
                await sendEmail(
                    employee.email,
                    'New Performance Evaluation Created',
                    `Dear ${employee.username},\n\nA new performance evaluation has been created for you.`
                );
    
                // Create a notification
                const notification = new Notification({
                    recipientId: employee._id,
                    actorId: req.body.evaluatorId,
                    type: 'evaluation',
                    message: `A new performance evaluation has been created for you by ${req.body.evaluatorId}.`
                });
                await notification.save();
            }
           res.status(201).json(evaluation);
         }
         
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all performance evaluations
exports.getAllEvaluations = async (req, res) => {
    try {
        const evaluations = await PerformanceEvaluation.find().populate('employeeId', 'username').populate('evaluatorId', 'username');
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get evaluations by employee ID
exports.getEvaluationsByEmployee = async (req, res) => {

    try {
        const { employeeId } = req.params;
  
        console.log(employeeId);

      

        const evaluations = await PerformanceEvaluation.find({ employeeId: employeeId })
            .populate('employeeId', 'username')
            .populate('evaluatorId', 'username');
        res.status(200).json(evaluations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getEvaluationsByEmployeeManeger = async (req, res) => {
    const { employeeId, managerId } = req.params; // Get employeeId and managerId from params
    console.log(employeeId, managerId)
    try {
        const evaluation = await PerformanceEvaluation.findOne({ 
            employeeId: employeeId, 
            evaluatorId: managerId 
        });

        if (evaluation) {
            return res.status(200).json(evaluation); // Return existing evaluation
        } else {
            const ev= new PerformanceEvaluation();
            return res.status(200).json(ev); // No evaluation found
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error retrieving evaluation.' });
    }
};

// Update an evaluation
exports.updateEvaluation = async (req, res) => {
    try {
        const evaluation = await PerformanceEvaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

        // Find the employee and send email
        const employee = await User.findById(req.body.employeeId);
        if (employee) {
            // Send email to the employee
            await sendEmail(
                employee.email,
                'Performance Evaluation Updated',
                `Dear ${employee.username},\n\nYour performance evaluation has been updated.`
            );

            // Create a notification
            const notification = new Notification({
                recipientId: employee._id,
                actorId: req.body.evaluatorId,
                type: 'evaluation',
                message: `Your performance evaluation has been updated by ${req.body.evaluatorId}.`
            });
            await notification.save();
        }

        res.status(200).json(evaluation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete an evaluation
exports.deleteEvaluation = async (req, res) => {
    try {
        const evaluation = await PerformanceEvaluation.findByIdAndDelete(req.params.id);
        if (!evaluation) return res.status(404).json({ message: 'Evaluation not found' });

        // Find the employee and send email
        const employee = await User.findById(evaluation.employeeId);
        if (employee) {
            // Send email to the employee
            await sendEmail(
                employee.email,
                'Performance Evaluation Deleted',
                `Dear ${employee.username},\n\nYour performance evaluation has been deleted.`
            );

            // Create a notification
            const notification = new Notification({
                recipientId: employee._id,
                actorId: req.body.evaluatorId,
                type: 'evaluation',
                message: `Your performance evaluation has been deleted by ${req.body.evaluatorId}.`
            });
            await notification.save();
        }

        res.status(200).json({ message: 'Evaluation deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};