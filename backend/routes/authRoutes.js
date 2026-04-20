const express = require('express');
const router = express.Router();
const { signup, login, adminLogin, updateProfile, getNotifCounts, adminResetPassword, getAllUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/signup',               signup);
router.post('/login',                login);
router.post('/admin/login',          adminLogin);
router.put('/profile',               protect, updateProfile);
router.get('/admin/notifs',          protect, adminOnly, getNotifCounts);
router.get('/admin/users',           protect, adminOnly, getAllUsers);
router.put('/admin/reset-password',  protect, adminOnly, adminResetPassword);

module.exports = router;
