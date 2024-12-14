const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const congeSchema = new Schema({
    idemployee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    date_debut: {
        type: Date,
        required: true
    },
    date_fin: {
        type: Date,
        required: true
    },
    idmanager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // Initially null until manager approves
    },
    etat: {
        type: String,
        enum: ['accepter', 'refuser' ,'attend'],
        default: 'attend' // Default state is "refuser" until approved
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Conge', congeSchema);
