import { Link, useLocation } from 'react-router-dom';
import { Stethoscope, CalendarDays, LayoutDashboard, Sparkles, User, Menu } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Home', path: '/', icon: <Stethoscope className="w-4 h-4 mr-1" /> },
    { name: 'Doctors', path: '/doctors', icon: <User className="w-4 h-4 mr-1" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-1" /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <Sparkles className="w-4 h-4 mr-1" /> },
  ];

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 backdrop-blur-md bg-white/70 border-b border-gray-200/50 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
            <div className="bg-gradient-to-tr from-primary to-secondary p-2 rounded-xl shadow-lg shadow-teal-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <Link to="/" className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-900 tracking-tight">
              SmileAura
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path) 
                  ? 'bg-teal-50 text-primary shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-gray-300 flex items-center space-x-3">
              <Link 
                to="/auth" 
                className="text-gray-700 hover:text-primary px-4 py-2 rounded-full text-sm font-bold transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/booking" 
                className="group flex items-center bg-gradient-to-r from-primary to-secondary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                <CalendarDays className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                Book Now
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary p-2 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl pb-4 px-4 pt-2">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-primary"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-2 mt-2 flex flex-col gap-2">
              <Link to="/auth" className="text-center text-gray-700 hover:text-primary py-3 font-bold">Login</Link>
              <Link to="/booking" className="text-center bg-primary text-white py-3 rounded-lg font-bold shadow-md">Book Appointment</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
