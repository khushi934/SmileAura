import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Sparkles, ShieldCheck, Clock, Award, User } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-teal-50 pt-20">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-200/30 blur-3xl mix-blend-multiply pointer-events-none animate-blob"></div>
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] rounded-full bg-emerald-200/30 blur-3xl mix-blend-multiply pointer-events-none animate-blob animation-delay-2000"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-16 pb-24 md:pt-28 md:pb-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4" /> Rated #1 Dental Clinic 2026
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
              A Brighter Smile Awaits at <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-600">SmileAura</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto md:mx-0">
              Experience premium dental care with state-of-the-art technology and compassionate professionals. We prioritize your comfort and long-term dental health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link 
                to="/booking" 
                className="group relative flex items-center justify-center bg-primary text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-teal-500/40 overflow-hidden transition-all hover:scale-105"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <CalendarDays className="w-5 h-5 mr-2" />
                Book Appointment
              </Link>
              <Link 
                to="/ai-assistant" 
                className="group flex items-center justify-center bg-white text-gray-800 border-2 border-gray-200 hover:border-primary font-bold py-4 px-8 rounded-full shadow-sm transition-all hover:bg-gray-50 hover:shadow-md"
              >
                <Sparkles className="w-5 h-5 mr-2 text-primary group-hover:animate-pulse" />
                Ask AI Assistant
              </Link>
            </div>
          </motion.div>

          {/* Right Image/Card Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-400 to-primary rounded-[3rem] rotate-3 opacity-20 blur-xl"></div>
            <div className="relative bg-white p-2 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100">
               <img 
                 src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800&h=900" 
                 alt="Modern Dental Clinic" 
                 className="w-full h-[500px] object-cover rounded-[2.5rem]"
               />
               
               {/* Floating Badges */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                 className="absolute -left-6 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white"
               >
                 <div className="bg-blue-100 p-3 rounded-full"><ShieldCheck className="w-6 h-6 text-blue-600" /></div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">Certified</p>
                   <p className="text-xs text-gray-500">Professionals</p>
                 </div>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                 className="absolute -right-6 bottom-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-white"
               >
                 <div className="bg-amber-100 p-3 rounded-full"><Award className="w-6 h-6 text-amber-600" /></div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">4.9/5</p>
                   <p className="text-xs text-gray-500">Patient Rating</p>
                 </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-gray-200/60">
          {[
            { icon: <ShieldCheck className="w-6 h-6"/>, title: "Advanced Tech" },
            { icon: <User className="w-6 h-6"/>, title: "Expert Doctors" },
            { icon: <Clock className="w-6 h-6"/>, title: "24/7 Support" },
            { icon: <Sparkles className="w-6 h-6"/>, title: "AI Diagnostics" },
          ].map((feat, idx) => (
             <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all cursor-pointer group">
               <div className="text-primary bg-teal-50 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform">
                 {feat.icon}
               </div>
               <h3 className="font-semibold text-gray-800">{feat.title}</h3>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
