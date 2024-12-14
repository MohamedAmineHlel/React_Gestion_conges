const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pauseSchema = new Schema({
    idemployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    nb_heures: {
        type: Number,
        required: true
    },
    idmanager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Initially null until manager approves
    },
    etat: {
        type: String,
        enum: ['accepter', 'refuser','attend'],
        default: 'attend' // Default state is "refuser" until approved
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Pause', pauseSchema);
