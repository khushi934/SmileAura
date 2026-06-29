const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public (in a real app this should be protected by Auth)
const createAppointment = async (req, res) => {
  const { patientId, doctorId, clinicId, date, time, problemDescription, amount } = req.body;

  try {
    // Basic validation
    if (!doctorId || !clinicId || !date || !time) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // In a real app with JWT auth, patientId comes from req.user._id
    // For testing without strict auth, we accept it from body or fallback to null (if schema allows, but patient is required. We'll use a placeholder or handle it from frontend)
    
    const appointment = new Appointment({
      patient: patientId || "60d0fe4f5311236168a109ca", // fallback for testing if no user is logged in
      doctor: doctorId,
      clinic: clinicId,
      date,
      time,
      problemDescription,
      amount: amount || 500 // Default to 500 if not provided
    });

    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all appointments (For dashboard)
// @route   GET /api/appointments
// @access  Public
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('patient', 'name email')
      .populate('doctor', 'user specialty')
      .populate('clinic', 'name location');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createAppointment, getAppointments };
