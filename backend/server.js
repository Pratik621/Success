require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');

const authRoutes     = require('./routes/authRoutes');
const dealRoutes     = require('./routes/dealRoutes');
const metalRoutes    = require('./routes/metalRoutes');
const reviewRoutes   = require('./routes/reviewRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const referralRoutes = require('./routes/referralRoutes');
const contactRoutes  = require('./routes/contactRoutes');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth',      authRoutes);
app.use('/api/deals',     dealRoutes);
app.use('/api/metals',    metalRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/contact',   contactRoutes);

const seedAdmin = async () => {
  try {
    const exists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!exists) {
      await User.create({
        companyName: 'Admin',
        companyAddress: 'Admin HQ',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        phone: '0000000000',
        role: 'admin',
      });
      console.log('Admin account created');
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};
seedAdmin();

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));
app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
