const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true },
    rating:      { type: Number, required: true, min: 1, max: 5 },
    comment:     { type: String, required: true, trim: true },
    status:      { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  },
  { timestamps: true }
);

reviewSchema.index({ userId: 1 });
reviewSchema.index({ status: 1 });

module.exports = mongoose.model('Review', reviewSchema);
