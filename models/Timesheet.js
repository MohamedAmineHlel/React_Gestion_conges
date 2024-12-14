// models/Timesheet.js
const mongoose = require('mongoose');

const TimesheetSchema = new mongoose.Schema({
    idEmployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for employees
        required: false,
        unique:true
    },
    idManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model for managers
        default:null,
    },
    etat: {
        type: String,
        enum: ['accepter', 'refuser', 'attend'],
        default: 'attend'
    },
    description: {
        type: String,
        required: true
    },
    jours: [{
        jour: {
            type: String,
            enum: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
            required: true
        },
        periodes: {
            matin: {
                type: Boolean,
                default: false // Set to true if the employee works in the morning on this day
            },
            soir: {
                type: Boolean,
                default: false // Set to true if the employee works in the evening on this day
            }
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Timesheet', TimesheetSchema);
