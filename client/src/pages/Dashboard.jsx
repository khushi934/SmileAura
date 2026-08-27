import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Building2, Phone, X, CheckCircle2, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [clinics, setClinics] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const [clinicsRes, appointmentsRes] = await Promise.all([
          axios.get('/api/data/clinics'),
          axios.get(`/api/appointments?patientId=${userInfo._id}`)
        ]);
        
        setClinics(clinicsRes.data);
        
        // If user is a Doctor, we might fetch all and filter by doctor user id, or just fetch all
        if (userInfo.role === 'Doctor') {
           const allAppsRes = await axios.get('/api/appointments');
           // Filter where doctor's user name matches, or just show all for demo
           setAppointments(allAppsRes.data.filter(app => app.doctor?.user?.name === userInfo.name || app.doctor?.user === userInfo._id));
        } else {
           setAppointments(appointmentsRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate, userInfo]);

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
        <div className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome, {userInfo?.name}</h1>
          <p className="text-xl text-gray-600">Manage your appointments and explore our clinics.</p>
        </div>

        {/* Appointments Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
             <Calendar className="w-6 h-6 text-primary" /> 
             {userInfo?.role === 'Doctor' ? 'Your Schedule' : 'Your Appointments'}
          </h2>
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
               <p className="text-gray-500 mb-4">You have no upcoming appointments.</p>
               {userInfo?.role !== 'Doctor' && (
                 <button onClick={() => navigate('/booking')} className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-secondary transition">
                   Book Now
                 </button>
               )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appointments.map((app) => (
                <div key={app._id} className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-primary flex flex-col gap-3 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 bg-teal-50 px-3 py-1 rounded-bl-xl text-xs font-bold text-primary">
                      Confirmed
                   </div>
                   <h3 className="font-bold text-lg text-gray-900">
                     {userInfo?.role === 'Doctor' ? `Patient: ${app.patient?.name}` : `Dr. ${app.doctor?.user?.name || 'Assigned Specialist'}`}
                   </h3>
                   <div className="text-sm text-gray-600 flex flex-col gap-1.5">
                     <div className="flex justify-between border-b pb-1">
                        <span className="font-semibold text-gray-500">Date</span>
                        <span className="text-gray-900">{app.date}</span>
                     </div>
                     <div className="flex justify-between border-b pb-1">
                        <span className="font-semibold text-gray-500">Time</span>
                        <span className="text-gray-900">{app.time}</span>
                     </div>
                     <div className="flex justify-between border-b pb-1">
                        <span className="font-semibold text-gray-500">Clinic</span>
                        <span className="text-gray-900 truncate max-w-[120px]">{app.clinic?.name}</span>
                     </div>
                   </div>
                   {app.problemDescription && (
                     <div className="mt-2 text-sm bg-gray-50 p-3 rounded-lg text-gray-600 italic">
                        "{app.problemDescription}"
                     </div>
                   )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clinics Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b pb-4">
             <Building2 className="w-6 h-6 text-primary" /> Clinic Directory
          </h2>
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
      </div>

      {/* Modal matching original design kept intact */}
      <AnimatePresence>
        {selectedClinic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
