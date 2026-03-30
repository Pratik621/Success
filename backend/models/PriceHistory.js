const mongoose = require('mongoose');

const priceHistorySchema = new mongoose.Schema({
  metalId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Metal', required: true },
  metalName: { type: String, required: true },
  oldPrice:  { type: Number, required: true },
  newPrice:  { type: Number, required: true },
  changedAt: { type: Date, default: Date.now },
});

priceHistorySchema.index({ metalId: 1 });

module.exports = mongoose.model('PriceHistory', priceHistorySchema);
