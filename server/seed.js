const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Clinic = require('./models/Clinic');
const Doctor = require('./models/Doctor');

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data (optional, doing it to start fresh)
    await Doctor.deleteMany();
    await Clinic.deleteMany();
    await User.deleteMany({ role: 'Doctor' }); // Only delete doctor users to preserve patients

    // 1. Create Clinics in Lucknow
    const clinics = await Clinic.insertMany([
      {
        name: 'Advanced Dental Clinic',
        location: 'Aliganj, Lucknow',
        services: ['Conservative Dentistry', 'Endodontics', 'Root Canal'],
        operatingHours: '10:00 AM - 8:00 PM',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Pushpa Dental Speciality Center',
        location: 'Gomti Nagar, Lucknow',
        services: ['General Dentistry', 'Orthodontics', 'Implants'],
        operatingHours: '9:00 AM - 9:00 PM',
        image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
      },
      {
        name: 'Realtooth Dental Clinic',
        location: 'Mahanagar, Lucknow',
        services: ['Cosmetic Dentistry', 'Surgical Techniques', 'Braces'],
        operatingHours: '10:00 AM - 7:30 PM',
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
      }
    ]);

    // 2. Create User accounts for Doctors
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const doctorUsers = await User.insertMany([
      {
        name: 'Dr. Abhinav Singh',
        email: 'abhinav.singh@example.com',
        password: hashedPassword,
        role: 'Doctor'
      },
      {
        name: 'Dr. Vikas Kumar',
        email: 'vikas.kumar@example.com',
        password: hashedPassword,
        role: 'Doctor'
      },
      {
        name: 'Dr. Preeti Singh',
        email: 'preeti.singh@example.com',
        password: hashedPassword,
        role: 'Doctor'
      }
    ]);

    // 3. Link Doctors to Users and Clinics
    await Doctor.insertMany([
      {
        user: doctorUsers[0]._id,
        specialty: 'Endodontics & Conservative Dentistry',
        experienceYears: 12,
        clinic: clinics[0]._id, // Advanced Dental Clinic
        image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400'
      },
      {
        user: doctorUsers[1]._id,
        specialty: 'Orthodontics & Implants',
        experienceYears: 15,
        clinic: clinics[1]._id, // Pushpa Dental
        image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400'
      },
      {
        user: doctorUsers[2]._id,
        specialty: 'General & Cosmetic Dentistry',
        experienceYears: 10,
        clinic: clinics[1]._id, // Pushpa Dental (Multiple doctors in one clinic)
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400'
      }
    ]);

    console.log('Real Lucknow Dentists and Clinics Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
