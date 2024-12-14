const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const performanceEvaluationSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to Users collection (employee)
        required: true
    },
    evaluatorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  // Reference to Users collection (HR evaluator)
        required: true
    },
    evaluationDate: {
        type: Date,
        default: Date.now
    },
    score: {
        type: Number,
        min: 1,
        max: 100,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const PerformanceEvaluation = mongoose.model('PerformanceEvaluation', performanceEvaluationSchema);
module.exports = PerformanceEvaluation;
