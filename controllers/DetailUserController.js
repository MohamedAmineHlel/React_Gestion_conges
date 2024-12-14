// controllers/DetailUserController.js
const DetailUser = require('../models/detailUser');
const User = require('../models/user');
// Create new user detail
// exports.createDetailUser = async (req, res) => {
//     try {
//         const newDetailUser = new DetailUser(req.body);
//         await newDetailUser.save();
//         res.status(201).json(newDetailUser);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// controllers/DetailUserController.js
exports.createDetailUser = async (req, res) => {
    try {
        const newDetailUser = new DetailUser({ ...req.body, iduser: req.body.userId });
        await newDetailUser.save();
        res.status(201).json(newDetailUser);
    } catch (error) {
        console.error('Error creating DetailUser:', error);  // Log the error for debugging
        res.status(500).json({ error: error.message });
    }
};
// Get user detail by ID
exports.getUserDetail = async (req, res) => {
    try {
        const detailUser = await DetailUser.findOne({ iduser: req.params.id }).populate('iduser');
        if (!detailUser) {
            return res.status(404).json({ message: 'DetailUser not found' });
        }
        res.status(200).json(detailUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user detail by ID
exports.updateUserDetail = async (req, res) => {
    try {
        const updatedDetailUser = await DetailUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDetailUser) {
            return res.status(404).json({ message: 'DetailUser not found' });
        }
        res.status(200).json(updatedDetailUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Update detail by userId
// Update detail by userId
exports.updateDetailByUserId = async (req, res) => {
    try {
        // First, find the detail using iduser
      
        console.log(req.params.id);
        const existingDetailUser = await DetailUser.findOne({ iduser: req.params.id });

        if (!existingDetailUser) {
            return res.status(405).json({ message: 'DetailUser not found' });
        }

        // Log the found detail
        console.log('Existing DetailUser:', existingDetailUser);

        // Now, update the detail
        const updatedDetailUser = await DetailUser.findOneAndUpdate(
            { iduser: req.params.id }, // Query by iduser
            req.body, // Update data
            { new: true } // Return the updated document
        );

        res.status(200).json(updatedDetailUser); // Send back the updated detail

    } catch (error) {
        res.status(500).json({ error: error.message }); // Error handling
    }
};


// Delete user detail
exports.deleteUserDetail = async (req, res) => {
    try {
        const deletedDetailUser = await DetailUser.findByIdAndDelete(req.params.id);
        if (!deletedDetailUser) {
            return res.status(404).json({ message: 'DetailUser not found' });
        }
        res.status(200).json({ message: 'DetailUser deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }


};
// Find DetailUser by User's email  
exports.findDetailUserByEmail = async (req, res) => {
    try {
        // First, find the user by email
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // Added return to stop execution
        }

        // Then, find the DetailUser by the user ID
        const detailUser = await DetailUser.findOne({ iduser: user._id });
        if (!detailUser) {
            return res.status(404).json({ message: 'DetailUser not found for this user' });
        }

        res.status(200).json(detailUser);
    } catch (error) {
        console.error('Error fetching DetailUser by email:', error);
        res.status(500).json({ message: 'Error fetching DetailUser' });
    }
};

// Adjust nombre_jours_conge by userId when leave is approved
exports.adjustLeaveDays = async (req, res) => {
    try {
        const { nombre_jours_conge } = req.body;
        const detailUser = await DetailUser.findOne({ iduser: req.params.id });
        console.log(nombre_jours_conge ,"gghg",req.params.id);
        if (!detailUser) {
            return res.status(404).json({ message: 'DetailUser not found' });
        }

        // Subtract leave days from nombre_jours_conge
        detailUser.nombre_jours_conge -= nombre_jours_conge;

        await detailUser.save();
        res.status(200).json({ message: 'nombre_jours_conge updated successfully', detailUser });
    } catch (error) {
        console.error('Error adjusting nombre_jours_conge:', error);
        res.status(500).json({ error: error.message });
    }
};


