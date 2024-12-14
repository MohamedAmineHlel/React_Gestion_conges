const Conge = require('../models/Conge')
const nodemailer = require('nodemailer');
const User = require('../models/user');  
const Notification = require('../models/Notification');
const DetailUser = require('../models/detailUser');
// Function to send email
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
// Create new leave (congé)
exports.createCongeA = async (req, res) => {
    try {
        const newConge = new Conge(req.body);
        console.log(newConge);
        await newConge.save();
        res.status(201).json(newConge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createConge = async (req, res) => {
    try {
        // Création du nouveau congé
        const newConge = new Conge(req.body);
        console.log(newConge);
        await newConge.save();

        // Trouver tous les managers
        const managers = await User.find({ role: 'manager' });

        // Créer une notification pour chaque manager
        const notifications = managers.map(manager => ({
            recipientId: manager._id,
            actorId: newConge.idemployee, // L'employé qui a créé le congé
            type: 'leave',
            message: `New leave request from employee ${newConge.idemployee}.`
        }));

        // Insérer toutes les notifications dans la base de données
        await Notification.insertMany(notifications);

        res.status(201).json(newConge);
    } catch (error) {
        console.error('Error in createConge:', error);
        res.status(500).json({ error: error.message });
    }
};
// Get all leaves.populate('idUser', 'username')
exports.getConges = async (req, res) => {
    try {
        const conges = await Conge.find().populate({
            path: 'idemployee', // Charger les informations de l'employé
            select: 'username role', // Inclure uniquement 'username' et 'role'
            match: { role: 'employee' } // Filtrer les employés ayant le rôle 'employee'
        }).populate('idmanager', 'username');
        res.status(200).json(conges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getCongesEmployer = async (req, res) => {
    try {
        const conges = await Conge.find().populate('idemployee', 'username').populate('idmanager', 'username');
        res.status(200).json(conges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all leaves.populate('idUser', 'username')
exports.getCongesByid = async (req, res) => {
    try {
        const conges = await Conge.findById(req.params.id).populate('idemployee', 'username').populate('idmanager', 'username');
        res.status(200).json(conges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Approve or reject a leave (update manager and status)
// exports.updateCongemanager = async (req, res) => {
//     try {
//         const updatedConge = await Conge.findByIdAndUpdate(req.params.id, {
//             idmanager: req.body.idmanager,
//             etat: req.body.etat
//         }, { new: true });
//         if (!updatedConge) {
//             return res.status(404).json({ message: 'Conge not found' });
//         }
//         res.status(200).json(updatedConge);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
// exports.updateCongemanager = async (req, res) => {
//     try {
//         const { idmanager, etat } = req.body;
//         console.log(idmanager, etat)
//         // Validate required fields
//         if (!idmanager || !etat) {
//             return res.status(400).json({ message: 'idmanager and etat are required.' });
//         }

//         const updatedConge = await Conge.findByIdAndUpdate(req.params.id, { idmanager, etat }, { new: true });
        
//         if (!updatedConge) {
//             return res.status(404).json({ message: 'Conge not found' });
//         }

//         res.status(200).json(updatedConge);
//     } catch (error) {
//         console.error('Error in updateCongemanager:', error); // More detailed log
//         res.status(500).json({ error: error.message });
//     }
// };
// Update the conge status and send email to the employee
exports.updateCongemanagerA = async (req, res) => {
    try {
        const { idmanager, etat } = req.body;
        console.log(idmanager, etat);

        // Validate required fields
        if (!idmanager || !etat) {
            return res.status(400).json({ message: 'idmanager and etat are required.' });
        }

        // Find the conge by ID
        const conge = await Conge.findById(req.params.id);

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        // Find the employee (idemployee) associated with this leave request
        const employee = await User.findById(conge.idemployee);
        const manager = await User.findById(idmanager);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Update the conge with the manager's decision
        const updatedConge = await Conge.findByIdAndUpdate(
            req.params.id,
            { idmanager, etat },
            { new: true }
        );
        if (etat==='accepter'){
           const DU =DetailUser.findOne({iduser:Conge.idemployee})
        }
        if (!updatedConge) {
            return res.status(404).json({ message: 'Conge update failed' });
        }

        // Send an email to the employee informing them of the decision
        const message = `Your leave request has been ${etat === 'accepter' ? 'approved' : 'rejected'} by the manager ${manager.username}.`;
        await sendEmail(employee.email, `Leave Request ${etat === 'accepter' ? 'Approved' : 'Rejected'}`, message);

        res.status(200).json(updatedConge);
    } catch (error) {
        console.error('Error in updateCongemanager:', error);
        res.status(500).json({ error: error.message });
    }
};



exports.updateCongemanager = async (req, res) => {
    try {
        const { idmanager, etat } = req.body;
        console.log(idmanager, etat);

        // Valider les champs requis
        if (!idmanager || !etat) {
            return res.status(400).json({ message: 'idmanager and etat are required.' });
        }

        // Trouver le congé par ID
        const conge = await Conge.findById(req.params.id);

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        // Trouver l'employé associé au congé
        const employee = await User.findById(conge.idemployee);
        const manager = await User.findById(idmanager);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Récupérer les détails de l'utilisateur
        const detailUser = await DetailUser.findOne({ iduser: conge.idemployee });
        console.log(detailUser);
        if (!detailUser) {
            return res.status(404).json({ message: 'DetailUser not found for this employee.' });
        }

        // Calcul de la différence en jours entre date de début et date de fin
        const diffTime = Math.abs(new Date(conge.date_fin) - new Date(conge.date_debut));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convertir en jours
        console.log(diffDays) 
        // Gérer les cas selon les états
        if (conge.etat !== 'accepter' && etat === 'accepter') {
            // Si l'ancien état n'était pas "accepter" et le nouvel état est "accepter"
            detailUser.nombre_jours_conge -= diffDays;
            if (detailUser.nombre_jours_conge < 0) detailUser.nombre_jours_conge = 0; // S'assurer que ce n'est pas négatif
        } else if (conge.etat === 'accepter' && (etat === 'attend' || etat === 'refuser')) {
            // Si l'ancien état était "accepter" et le nouvel état est "attend" ou "refuser"
            detailUser.nombre_jours_conge += diffDays;
        }

        // Sauvegarder les modifications dans DetailUser
        await detailUser.save();

        // Mettre à jour le congé avec la décision du manager
        const updatedConge = await Conge.findByIdAndUpdate(
            req.params.id,
            { idmanager, etat },
            { new: true }
        );

        if (!updatedConge) {
            return res.status(404).json({ message: 'Conge update failed' });
        }

        // Envoyer un email à l'employé pour l'informer de la décision
        const message = `Your leave request has been ${etat === 'accepter' ? 'approved' : etat === 'refuser' ? 'rejected' : 'put on hold'} by the manager ${manager.username}.`;
        await sendEmail(employee.email, `Leave Request ${etat}`, message);

        res.status(200).json(updatedConge);
    } catch (error) {
        console.error('Error in updateCongemanager:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.getCongesAttendees = async (req, res) => {
    try {
        const pendingLeaves = await LeaveRequest.find({ status: 'attend' });
        res.status(200).json(pendingLeaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Delete a leave (congé)
exports.deleteConge = async (req, res) => {
    try {
        const deletedConge = await Conge.findByIdAndDelete(req.params.id);
        if (!deletedConge) {
            return res.status(404).json({ message: 'Conge not found' });
        }
        res.status(200).json({ message: 'Conge deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get Conge (leave) details by actorId (or other criteria as needed)
exports.getCongeDetails = async (req, res) => {
    try {
        const conge = await Conge.findOne({ idemployee: req.params.actorId })
            .populate('idemployee', 'username')  // Populate the employee's name
            .populate('idmanager', 'username'); // Optionally populate the manager's name if needed

        if (!conge) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json(conge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all Conge (leave) details by actorId
exports.getCongeuser = async (req, res) => {
    try {
        const conge = await Conge.find({ idemployee: req.params.actorId })
            .populate('idemployee', 'username')  // Populate the employee's name
            .populate('idmanager', 'username'); // Optionally populate the manager's name if needed

        if (!conge) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        res.status(200).json(conge);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get Conge details by actorId and createdAt
exports.getCongeByActorAndDate = async (req, res) => {
    const { actorId, createdAt } = req.params;
    try {
        const createdAtDate = new Date(createdAt);
        console.log("louwel",createdAt)
        console.log("theny",createdAtDate)
        const conge = await Conge.findOne({
            'idemployee': actorId,
        }).populate('idemployee', 'username email role'); // Populating employee details

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        res.json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update Conge details (e.g., modify date_debut, date_fin, etat)
exports.updateConge = async (req, res) => {
    const { actorId, createdAt } = req.params;
    const { date_debut, date_fin, etat } = req.body;

    try {
        const conge = await Conge.findOneAndUpdate(
            {
                'idemployee': actorId,
                'createdAt': createdAt
            },
            { date_debut, date_fin, etat },
            { new: true }
        );

        if (!conge) {
            return res.status(404).json({ message: 'Conge not found' });
        }

        res.json(conge);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller function to fetch leave statistics
exports.getLeaveDashboardData = async (req, res) => {
    try {
        const userId = req.params.id; // Get the user ID from the request parameters

        // Fetch all leave requests for the specific user
        const conges = await Conge.find({ idemployee: userId });
     
        // Initialize counts for all statuses
        const stats = {
            accepter: 0,
            refuser: 0,
            attend: 0,
        };

        // Count leave requests by status
        conges.forEach((conge) => {
            if (conge.etat == 'accepter') stats.accepter++;
            else if (conge.etat == 'refuser') stats.refuser++;
            else if (conge.etat == 'attend') stats.attend++;
        });

        // Send the data as JSON
        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching leave dashboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leave dashboard data' });
    }
};
