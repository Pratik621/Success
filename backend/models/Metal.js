const mongoose = require('mongoose');

const metalSchema = new mongoose.Schema(
  {
    metalName: { type: String, required: true, unique: true, trim: true },
    pricePerKg: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

metalSchema.index({ metalName: 1 });

module.exports = mongoose.model('Metal', metalSchema);
