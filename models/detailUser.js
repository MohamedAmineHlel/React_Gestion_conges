// models/DetailUser.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const detailUserSchema = new Schema({
    iduser: {
        type: mongoose.Schema.Types.ObjectId,  // This references the User model
        ref: 'User',
        required: true,
        unique: true 
    },
    department: {
        type: String,
        required: true
    },
    poste: {
        type: String,
        required: true
    },
    date_debut_travail: {
        type: Date,
        required: true
    },
    salaire: {
        type: Number,
        required: true
    },
    nombre_jours_conge: {
        type: Number,
        required: true,
        default: 21  // Default to 0 if no leave days are available
    }
}, { timestamps: true });

module.exports = mongoose.model('DetailUser', detailUserSchema);
