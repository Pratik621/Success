const Metal = require('../models/Metal');
const PriceHistory = require('../models/PriceHistory');

const getMetals = async (req, res) => {
  try {
    const metals = await Metal.find().sort({ metalName: 1 });
    res.json(metals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addMetal = async (req, res) => {
  try {
    const { metalName, pricePerKg } = req.body;
    if (!metalName || !pricePerKg)
      return res.status(400).json({ message: 'Metal name and price are required' });

    const exists = await Metal.findOne({ metalName: { $regex: new RegExp(`^${metalName}$`, 'i') } });
    if (exists) return res.status(400).json({ message: 'Metal already exists' });

    const metal = await Metal.create({ metalName, pricePerKg });
    res.status(201).json(metal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMetal = async (req, res) => {
  try {
    const { pricePerKg, metalName } = req.body;
    const existing = await Metal.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Metal not found' });

    // Record price history if price changed
    if (pricePerKg && Number(pricePerKg) !== existing.pricePerKg) {
      await PriceHistory.create({
        metalId:   existing._id,
        metalName: metalName || existing.metalName,
        oldPrice:  existing.pricePerKg,
        newPrice:  Number(pricePerKg),
      });
    }

    const metal = await Metal.findByIdAndUpdate(
      req.params.id,
      { pricePerKg, metalName, updatedAt: Date.now() },
      { new: true }
    );
    res.json(metal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMetal = async (req, res) => {
  try {
    const metal = await Metal.findByIdAndDelete(req.params.id);
    if (!metal) return res.status(404).json({ message: 'Metal not found' });
    res.json({ message: 'Metal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPriceHistory = async (req, res) => {
  try {
    // Show last 3 price changes — enough to see a clear trend
    const history = await PriceHistory.find({ metalId: req.params.id })
      .sort({ changedAt: -1 }).limit(3);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllPriceHistory = async (req, res) => {
  try {
    const history = await PriceHistory.find().sort({ changedAt: -1 }).limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMetals, addMetal, updateMetal, deleteMetal, getPriceHistory, getAllPriceHistory };
