import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock, User as UserIcon, Building2, CheckCircle2 } from 'lucide-react';

const Booking = () => {
  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
    clinicId: '',
    date: '',
    time: '',
    problemDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Get logged in user from localStorage
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    // Fetch doctors and clinics to populate the select dropdowns
    const fetchData = async () => {
      try {
        const [docsRes, clinicsRes] = await Promise.all([
          axios.get('/api/data/doctors'),
          axios.get('/api/data/clinics')
        ]);
        setDoctors(docsRes.data);
        setClinics(clinicsRes.data);
        
        if (docsRes.data.length > 0) {
          const preselectedId = location.state?.selectedDoctorId;
          const targetDoc = docsRes.data.find(d => d._id === preselectedId) || docsRes.data[0];
          setFormData(prev => ({ 
            ...prev, 
            doctorId: targetDoc._id, 
            clinicId: targetDoc.clinic?._id 
          }));
        }
      } catch (err) {
        console.error('Failed to fetch data for booking', err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'doctorId') {
      // Auto select the clinic associated with the doctor
      const selectedDoc = doctors.find(d => d._id === value);
      setFormData({
        ...formData,
        doctorId: value,
        clinicId: selectedDoc?.clinic?._id || formData.clinicId
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        patientId: userInfo ? userInfo._id : null
      };
      
      await axios.post('/api/appointments', payload);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-16 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border border-teal-100"
        >
          <div className="mx-auto w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-8">Your appointment has been successfully scheduled. We look forward to seeing you at SmileAura.</p>
          <p className="text-sm text-gray-400">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center bg-no-repeat bg-fixed pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-teal-900/60 backdrop-blur-sm pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary px-8 py-8 text-white">
            <h1 className="text-3xl font-extrabold mb-2">Book an Appointment</h1>
            <p className="text-teal-100">Schedule your visit with our premium dental specialists.</p>
          </div>

          <div className="p-8">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-primary" /> Select Specialist
                  </label>
                  <select 
                    name="doctorId" 
                    value={formData.doctorId} 
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    {doctors.map(doc => (
                      <option key={doc._id} value={doc._id}>
                        {doc.user.name} - {doc.specialty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Clinic Selection (Auto-filled but changeable) */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> Select Clinic
                  </label>
                  <select 
                    name="clinicId" 
                    value={formData.clinicId} 
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a clinic</option>
                    {clinics.map(clinic => (
                      <option key={clinic._id} value={clinic._id}>
                        {clinic.name} ({clinic.location})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Date Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-primary" /> Date
                  </label>
                  <input 
                    type="date" 
                    name="date" 
                    value={formData.date} 
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" /> Preferred Time
                  </label>
                  <select 
                    name="time" 
                    value={formData.time} 
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  >
                    <option value="">Select a time</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">What is your dental concern?</label>
                <textarea 
                  name="problemDescription" 
                  value={formData.problemDescription} 
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your symptoms or reason for visit..."
                  className="w-full border border-gray-200 rounded-xl p-3 bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                ></textarea>
              </div>

              {!userInfo ? (
                <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm flex flex-col items-center gap-3 text-center">
                  <UserIcon className="w-8 h-8 shrink-0 text-red-400" />
                  <p className="text-base">Authentication is required to book an appointment.</p>
                  <button 
                    type="button"
                    onClick={() => navigate('/auth')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-2"
                  >
                    Log In to Continue
                  </button>
                </div>
              ) : (
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-teal-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-teal-500/30 transform transition-all hover:-translate-y-0.5 focus:outline-none disabled:opacity-70 flex justify-center items-center"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
