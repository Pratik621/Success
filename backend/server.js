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


// ================== ✅ TEMPORARY CORS (WORKING) ==================
// This allows ALL origins (fixes your current error)

app.use(cors());


// ================== ❌ OLD CORS CONFIG (COMMENTED) ==================
// This was your previous setup (causing issues now)

// const corsOptions = {
//   origin: process.env.FRONTEND_URL || 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));


// ================== ❌ CUSTOM CORS (COMMENTED) ==================
// This also caused conflict when used with app.use(cors())

// const allowedOrigins = [
//   'http://localhost:5173',
//   process.env.FRONTEND_URL
// ];

// app.use(cors({
//   origin: function(origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));


// ================== ✅ CONNECT DATABASE ==================
connectDB();


// ================== ✅ MIDDLEWARE ==================
app.use(express.json());


// ================== ✅ ROUTES ==================
app.use('/api/auth',      authRoutes);
app.use('/api/deals',     dealRoutes);
app.use('/api/metals',    metalRoutes);
app.use('/api/reviews',   reviewRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/contact',   contactRoutes);


// ================== ✅ ADMIN SEED ==================
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


// ================== ✅ ERROR HANDLING ==================
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

app.use((err, req, res, next) => 
  res.status(500).json({ message: err.message })
);


// ================== ✅ SERVER START ==================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
  console.log(`Server running on port ${PORT}`)
);