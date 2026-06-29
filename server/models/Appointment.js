const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  problemDescription: {
    type: String
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'],
    default: 'Pending'
  },
  transactionId: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
