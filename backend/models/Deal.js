const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    phone: { type: String, required: true },
    companyAddress: { type: String, required: true },
    metalType: { type: String, required: true },
    weight: { type: Number, required: true },
    weightUnit: { type: String, enum: ['kg', 'ton'], default: 'kg' },
    rate: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], default: 'Pending' },
    counterRate:   { type: Number, default: null },
    counterNote:   { type: String, default: '' },
    counterStatus: { type: String, enum: ['None', 'Pending', 'Accepted', 'Declined'], default: 'None' },
  },
  { timestamps: true }
);

dealSchema.index({ userId: 1 });
dealSchema.index({ status: 1 });

module.exports = mongoose.model('Deal', dealSchema);
