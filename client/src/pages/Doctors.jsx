import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Stethoscope, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('/api/data/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Elite Dentists in Lucknow</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Meet our highly qualified specialists dedicated to providing you with the best dental care possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {doctors.map((doctor, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={doctor._id} 
              className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col"
            >
              <div className="h-64 overflow-hidden relative shrink-0">
                <img 
                  src={doctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400"} 
                  alt={doctor.user.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white">{doctor.user.name}</h3>
                  <p className="text-teal-200 font-medium flex items-center gap-1">
                    <Stethoscope className="w-4 h-4" /> {doctor.specialty}
                  </p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col grow">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <Star className="w-5 h-5 text-amber-400 mr-1 fill-amber-400" />
                    <span className="font-bold text-gray-900 mr-1">4.9</span> (120+ reviews)
                  </div>
                  <span className="bg-teal-50 text-primary font-bold px-3 py-1 rounded-full text-sm">
                    {doctor.experienceYears} Yrs Exp
                  </span>
                </div>
                
                <div className="space-y-3 mb-6 grow">
                  <div className="flex items-start text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-primary shrink-0 mt-0.5" />
                    <span>{doctor.clinic?.name} <br/><span className="text-sm text-gray-400">{doctor.clinic?.location}</span></span>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <button 
                    onClick={() => setSelectedDoctor(doctor)}
                    className="flex-1 bg-white hover:bg-gray-50 text-primary border border-primary font-bold py-3 px-2 rounded-xl transition-all duration-300 text-sm"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => navigate('/booking', { state: { selectedDoctorId: doctor._id } })}
                    className="flex-1 bg-primary hover:bg-secondary text-white font-bold py-3 px-2 rounded-xl transition-all duration-300 shadow-md shadow-primary/30 text-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setSelectedDoctor(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <img 
                  src={selectedDoctor.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"} 
                  alt={selectedDoctor.user.name} 
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedDoctor.user.name}</h2>
                  <p className="text-primary font-semibold">{selectedDoctor.specialty}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">About Doctor</h3>
                  <p className="text-gray-700 leading-relaxed">
                    A highly experienced professional with {selectedDoctor.experienceYears} years in the field. 
                    Dedicated to providing the best {selectedDoctor.specialty.toLowerCase()} care using modern techniques and state-of-the-art equipment.
                  </p>
                </div>
                
                <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedDoctor.clinic?.name}</h3>
                    <p className="text-gray-600 text-sm">{selectedDoctor.clinic?.location}</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/booking', { state: { selectedDoctorId: selectedDoctor._id } })}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-teal-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/30"
              >
                Book Consultation Now
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;
