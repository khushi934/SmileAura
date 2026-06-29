const Clinic = require('../models/Clinic');
const Doctor = require('../models/Doctor');

// @desc    Get all clinics
// @route   GET /api/clinics
// @access  Public
const getClinics = async (req, res) => {
  try {
    const clinics = await Clinic.find({});
    res.json(clinics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
  try {
    // Populate the 'user' field to get the doctor's name from the User model
    // Populate the 'clinic' field to get the clinic name
    const doctors = await Doctor.find({})
      .populate('user', 'name email')
      .populate('clinic', 'name location');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getClinics, getDoctors };
