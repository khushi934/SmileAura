import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Building2, Phone, X, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('/api/data/clinics');
        setClinics(response.data);
      } catch (error) {
        console.error('Failed to fetch clinics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClinics();
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
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Clinic Directory</h1>
            <p className="text-xl text-gray-600">Discover our premium facilities across Lucknow.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {clinics.map((clinic, index) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              key={clinic._id} 
              className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 flex flex-col sm:flex-row"
            >
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <img 
                  src={clinic.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"} 
                  alt={clinic.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" /> {clinic.name}
                  </h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-gray-400" />
                      <span>{clinic.location}</span>
                    </div>
                    <div className="flex items-start text-gray-600 text-sm">
                      <Clock className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-gray-400" />
                      <span>{clinic.operatingHours}</span>
                    </div>
                    <div className="flex items-start text-gray-600 text-sm">
                      <Phone className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-gray-400" />
                      <span>+91 98765 43210</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {clinic.services.map((service, i) => (
                      <span key={i} className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-1 rounded">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedClinic(clinic)}
                  className="w-full text-center bg-gray-50 hover:bg-gray-100 text-primary font-bold py-2 rounded-lg transition-colors border border-gray-200"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedClinic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedClinic(null)}
                className="absolute top-4 right-4 z-10 text-white bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="h-48 relative shrink-0">
                <img 
                  src={selectedClinic.image || "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"} 
                  alt={selectedClinic.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-teal-300" /> {selectedClinic.name}
                  </h2>
                </div>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-start text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-bold">Address</p>
                        <p className="text-gray-600">{selectedClinic.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start text-gray-700">
                      <Clock className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-bold">Operating Hours</p>
                        <p className="text-gray-600">{selectedClinic.operatingHours}</p>
                      </div>
                    </div>
                    <div className="flex items-start text-gray-700">
                      <Phone className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-primary" />
                      <div>
                        <p className="font-bold">Contact</p>
                        <p className="text-gray-600">+91 98765 43210</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Services Offered</h3>
                    <ul className="space-y-2">
                      {selectedClinic.services.map((service, i) => (
                        <li key={i} className="flex items-center text-gray-700 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mr-2 shrink-0" />
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <button 
                  onClick={() => navigate('/booking')}
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-teal-800 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-teal-500/30"
                >
                  Book Appointment
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
