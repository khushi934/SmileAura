const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialty: {
    type: String,
    required: true
  },
  experienceYears: {
    type: Number,
    required: true
  },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Clinic'
  },
  image: {
    type: String // Cloudinary URL
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
