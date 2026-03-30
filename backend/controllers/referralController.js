const Referral = require('../models/Referral');

// User: submit referral
const createReferral = async (req, res) => {
  try {
    const { companyName, contactPerson, phone, note } = req.body;
    if (!companyName || !contactPerson || !phone)
      return res.status(400).json({ message: 'Company name, contact person and phone are required' });

    const referral = await Referral.create({
      referredBy:      req.user._id,
      referrerCompany: req.user.companyName,
      companyName,
      contactPerson,
      phone,
      note,
    });
    res.status(201).json(referral);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: get own referrals
const getMyReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find({ referredBy: req.user._id }).sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all referrals
const getAllReferrals = async (req, res) => {
  try {
    const referrals = await Referral.find().sort({ createdAt: -1 });
    res.json(referrals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: update referral status
const updateReferralStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['New', 'Contacted', 'Converted'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const referral = await Referral.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!referral) return res.status(404).json({ message: 'Referral not found' });
    res.json(referral);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReferral, getMyReferrals, getAllReferrals, updateReferralStatus };
