const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  services: [{
    type: String
  }],
  operatingHours: {
    type: String,
    required: true
  },
  image: {
    type: String // Cloudinary URL
  }
}, { timestamps: true });

const Clinic = mongoose.model('Clinic', clinicSchema);
module.exports = Clinic;
