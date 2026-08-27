import { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ShieldCheck } from 'lucide-react';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setError('Passwords do not match'), 100);
      return setError('');
    }
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      const response = await axios.put(`/api/auth/resetpassword/${resetToken}`, { password });
      setMessage(response.data.message || 'Password reset successfully.');
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=1920&h=1080')] bg-cover bg-center bg-no-repeat pt-16">
      <div className="absolute inset-0 bg-teal-900/40 backdrop-blur-sm"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md w-full mx-4"
      >
        <div className="bg-white/90 backdrop-blur-xl p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-teal-300 mb-4 shadow-lg shadow-teal-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-500">
              Enter your new password below.
            </p>
          </div>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-red-50/80 border border-red-200 text-red-600 p-4 rounded-xl text-sm text-center mb-6"
              >
                {error}
              </motion.div>
            )}
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-green-50/80 border border-green-200 text-green-600 p-4 rounded-xl text-sm text-center mb-6"
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="password"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 rounded-xl text-white bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-teal-800 font-bold shadow-lg shadow-teal-500/30 transform transition-all hover:-translate-y-0.5 focus:outline-none disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
