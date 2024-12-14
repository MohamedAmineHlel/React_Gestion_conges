const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    recipientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to Users collection
        required: true
    },
    actorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to Users collection
        required: true
    },
    type: {
        type: String,
        enum: ['leave', 'evaluation', 'timesheet'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
