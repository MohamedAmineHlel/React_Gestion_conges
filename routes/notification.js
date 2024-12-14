const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create a new notification
router.post('/', notificationController.createNotification);

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get notifications by recipient ID
router.get('/recipient/:recipientId', notificationController.getNotificationsByRecipient);

// Mark a notification as read
router.put('/:id/mark-as-read', notificationController.markAsRead);
// Create leave notification route
router.post('/conge', notificationController.createCongeNotif);
// Delete a notification
router.delete('/:id', notificationController.deleteNotification);
// Create leave decision notification route
router.post('/leave-decision', notificationController.createLeaveDecisionNotification);

module.exports = router;
