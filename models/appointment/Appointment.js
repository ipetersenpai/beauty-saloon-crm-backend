// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    selectedService: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    leaveNotes: {
        type: String,
        default: '',
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed'],
        default: 'pending',
    },
    dateCompleted: {
        type: Date,
        default: null,
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
