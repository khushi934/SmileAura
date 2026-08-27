import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Doctors from './pages/Doctors';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import AIAssistant from './pages/AIAssistant';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="/resetpassword/:resetToken" element={<ResetPassword />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
