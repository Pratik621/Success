const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    phone:       { type: String, required: true },
    metalType:   { type: String, required: true },
    pickupDate:  { type: Date, required: true },
    note:        { type: String, default: '' },
    status:      { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
  },
  { timestamps: true }
);

reminderSchema.index({ pickupDate: 1 });
reminderSchema.index({ userId: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
