const Notification = require('../models/Notification');
const User = require('../models/user');
// Create a new notification
exports.createNotification = async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Create notifications for all admins and managers when leave is requested
// exports.createCongeNotif = async (req, res) => {
//     try {
//         const { actorId, message } = req.body;

//         // Fetch all admins and managers
//         const adminsAndManagers = await User.find({ role: { $in: ['admin', 'manager'] } });

//         if (!adminsAndManagers || adminsAndManagers.length === 0) {
//             return res.status(404).json({ message: 'No admins or managers found.' });
//         }

//         // Create a notification for each admin and manager
//         const notifications = adminsAndManagers.map(adminOrManager => ({
//             recipientId: adminOrManager._id,
//             type: 'leave',
//             message: `Employee with ID: ${actorId} requested leave. ${message}`,
//         }));

//         // Insert notifications into the database
//         await Notification.insertMany(notifications);

//         res.status(200).json({ message: 'Notifications sent to admins and managers successfully.' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// Create notifications for all admins and managers when leave is requested
exports.createCongeNotif = async (req, res) => {
    try {
        const { actorId, message } = req.body;

        // Fetch all admins and managers
        const adminsAndManagers = await User.find({ role: { $in: ['admin', 'manager'] } });

        if (!adminsAndManagers || adminsAndManagers.length === 0) {
            return res.status(404).json({ message: 'No admins or managers found.' });
        }

        // Create a notification for each admin and manager, including actorId
        const notifications = adminsAndManagers.map(adminOrManager => ({
            recipientId: adminOrManager._id,
            actorId, // Include actorId (the employee who requested leave)
            type: 'leave',
            message: `${message}`,
        }));

        // Insert notifications into the database
        await Notification.insertMany(notifications);

        res.status(200).json({ message: 'Notifications sent to admins and managers successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get notifications for a specific recipient (admin/manager)
exports.getNotifications = async (req, res) => {
    try {
        const recipientId = req.params.recipientId;
        const notifications = await Notification.find({ recipientId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get all notifications
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find().populate('recipientId', 'email').populate('actorId', 'username');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Assuming you are using a middleware to handle user authentication
exports.getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get the logged-in user's ID (assuming you have middleware that populates `req.user`)

        // Fetch notifications where the recipientId matches the logged-in user's ID
        const notifications = await Notification.find({ recipientId: userId })
            .populate('recipientId', 'email')
            .populate('actorId', 'username') // Populate the actor's username
            .sort({ createdAt: -1 }); // Optionally sort by the creation date

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Get notifications by recipient ID
exports.getNotificationsByRecipient = async (req, res) => {
    try {
        const { recipientId } = req.params;
        const notifications = await Notification.find({ recipientId }).populate('recipientId', 'username');
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createLeaveDecisionNotification = async (req, res) => {
    try {
        const { recipientId, actorId, message } = req.body;

        // Create a single notification for the employee about leave decision
        const notification = new Notification({
            recipientId,  // Employee receiving the notification
            actorId,      // Manager who made the decision
            type: 'leave',
            message,      // Message about leave decision
            isRead: false,
            createdAt: Date.now()
        });

        await notification.save();
        res.status(201).json({ message: 'Notification sent to the employee successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};