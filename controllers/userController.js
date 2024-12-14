const User = require('../models/user');  // Assuming you have a User model
const DetailUser = require('../models/detailUser'); // Assuming you have DetailUser model for details
const bcrypt = require('bcryptjs');
// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();  // Fetch all users from the database
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const newUser = new User({ username, email, password, role });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    const { username, email, role } = req.body;
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};
// Update a user by email
exports.updateUserByEmail = async (req, res) => {
    const { username, email, role } = req.body;
    console.log('Update user', username, email, role);
    
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.params.email }); // Corrected query
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        user.username = username || user.username;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};
// Delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};


// Find user by email 
exports.findUserByEmail = async (req, res) => {
        const email = req.params.email;
    
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
         
            res.status(200).json(user);
        } catch (error) {
            console.error('Error fetching user by email:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
};

// Update user password
exports.updateUserPassword = async (req, res) => {
    const { password } = req.body;
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error });
    }
};
// Get all managers
exports.getAllManagers = async (req, res) => {
    try {
        console.log("maneger")

        // Assuming "MANAGER" is the role identifier for managers in your database
        const managers = await User.find({ role: "manager" });
        console.log(managers)
        if (!managers.length) {
            return res.status(404).json({ message: 'No managers found' });
        }

        res.status(200).json(managers);
    } catch (error) {
        console.error('Error fetching managers:', error);
        res.status(500).json({ message: 'Error fetching managers' });
    }
};