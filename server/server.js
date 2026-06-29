const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ override: true });
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const dataRoutes = require('./routes/dataRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/payment', paymentRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('SmileAura API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
