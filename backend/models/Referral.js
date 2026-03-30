const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema(
  {
    referredBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referrerCompany: { type: String, required: true },
    companyName:     { type: String, required: true },
    contactPerson:   { type: String, required: true },
    phone:           { type: String, required: true },
    note:            { type: String, default: '' },
    status:          { type: String, enum: ['New', 'Contacted', 'Converted'], default: 'New' },
  },
  { timestamps: true }
);

referralSchema.index({ referredBy: 1 });

module.exports = mongoose.model('Referral', referralSchema);
