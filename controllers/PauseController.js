const Pause = require('../models/Pause');

// Create new break (pause)
exports.createPause = async (req, res) => {
    try {
        const newPause = new Pause(req.body);
        await newPause.save();
        res.status(201).json(newPause);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all breaks (pauses)
exports.getPauses = async (req, res) => {
    try {
        const pauses = await Pause.find().populate('idemployee').populate('idmanager');
        res.status(200).json(pauses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Approve or reject a break (update manager and status)
exports.updatePause = async (req, res) => {
    try {
        const updatedPause = await Pause.findByIdAndUpdate(req.params.id, {
            idmanager: req.body.idmanager,
            etat: req.body.etat
        }, { new: true });
        if (!updatedPause) {
            return res.status(404).json({ message: 'Pause not found' });
        }
        res.status(200).json(updatedPause);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a break (pause)
exports.deletePause = async (req, res) => {
    try {
        const deletedPause = await Pause.findByIdAndDelete(req.params.id);
        if (!deletedPause) {
            return res.status(404).json({ message: 'Pause not found' });
        }
        res.status(200).json({ message: 'Pause deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
