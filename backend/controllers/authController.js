const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const formatUser = (user, token) => ({
  _id: user._id, companyName: user.companyName, companyAddress: user.companyAddress,
  email: user.email, phone: user.phone, role: user.role, token,
});

const signup = async (req, res) => {
  try {
    const { companyName, companyAddress, email, password, phone } = req.body;
    if (!companyName || !companyAddress || !email || !password || !phone)
      return res.status(400).json({ message: 'All fields are required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ companyName, companyAddress, email, password, phone });
    res.status(201).json(formatUser(user, generateToken(user._id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    res.json(formatUser(user, generateToken(user._id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid admin credentials' });
    res.json(formatUser(user, generateToken(user._id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

const updateProfile = async (req, res) => {
  try {
    const { companyName, companyAddress, phone, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (companyName)    user.companyName    = companyName;
    if (companyAddress) user.companyAddress = companyAddress;
    if (phone)          user.phone          = phone;

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ message: 'Current password required' });
      const match = await user.matchPassword(currentPassword);
      if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
      user.password = newPassword;
    }

    await user.save();
    res.json(formatUser(user, generateToken(user._id)));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin: fetch all registered users (non-admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('companyName companyAddress phone email')
      .sort({ companyName: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin notification counts
const getNotifCounts = async (req, res) => {
  try {
    const Deal    = require('../models/Deal');
    const Review  = require('../models/Review');
    const Referral = require('../models/Referral');
    const Reminder = require('../models/Reminder');

    const now = new Date();
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const [pendingDeals, pendingReviews, newReferrals, todayReminders] = await Promise.all([
      Deal.countDocuments({ status: 'Pending' }),
      Review.countDocuments({ status: 'Pending' }),
      Referral.countDocuments({ status: 'New' }),
      Reminder.countDocuments({ status: 'Pending', pickupDate: { $lte: todayEnd } }),
    ]);

    res.json({ pendingDeals, pendingReviews, newReferrals, todayReminders });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// Admin: reset any user's password by email
const adminResetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword)
      return res.status(400).json({ message: 'Email and new password are required' });
    if (newPassword.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const user = await User.findOne({ email: email.toLowerCase().trim(), role: 'user' });
    if (!user)
      return res.status(404).json({ message: 'No user found with this email' });

    user.password = newPassword;
    await user.save();
    res.json({ message: `Password reset successfully for ${user.companyName}`, companyName: user.companyName });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { signup, login, adminLogin, updateProfile, getNotifCounts, adminResetPassword, getAllUsers };
