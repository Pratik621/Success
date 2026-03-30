const Deal = require('../models/Deal');

const bookDeal = async (req, res) => {
  try {
    const { metalType, weight, weightUnit, rate, totalAmount } = req.body;
    if (!metalType || !weight || !rate || !totalAmount)
      return res.status(400).json({ message: 'All fields are required' });

    const deal = await Deal.create({
      userId: req.user._id,
      companyName: req.user.companyName,
      phone: req.user.phone,
      companyAddress: req.user.companyAddress,
      metalType, weight, weightUnit, rate, totalAmount,
    });
    res.status(201).json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyDeals = async (req, res) => {
  try {
    const { status, metal, search } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;
    if (metal)  filter.metalType = { $regex: metal, $options: 'i' };
    if (search) filter.$or = [
      { metalType: { $regex: search, $options: 'i' } },
      { status:    { $regex: search, $options: 'i' } },
    ];
    const deals = await Deal.find(filter).sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllDeals = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const deals = await Deal.find(filter).sort({ createdAt: -1 });
    res.json(deals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateDealStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['Accepted', 'Rejected', 'Completed'];
    if (!allowed.includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const deal = await Deal.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: send counter offer
const counterOffer = async (req, res) => {
  try {
    const { counterRate, counterNote } = req.body;
    if (!counterRate) return res.status(400).json({ message: 'Counter rate is required' });

    const deal = await Deal.findById(req.params.id);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });

    const newTotal = (deal.weight * Number(counterRate)).toFixed(2);
    const updated = await Deal.findByIdAndUpdate(req.params.id, {
      counterRate: Number(counterRate),
      counterNote: counterNote || '',
      counterStatus: 'Pending',
      totalAmount: Number(newTotal),
    }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: respond to counter offer
const respondCounter = async (req, res) => {
  try {
    const { accept } = req.body;
    const deal = await Deal.findOne({ _id: req.params.id, userId: req.user._id });
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    if (deal.counterStatus !== 'Pending') return res.status(400).json({ message: 'No pending counter offer' });

    const update = accept
      ? { counterStatus: 'Accepted', rate: deal.counterRate, totalAmount: deal.weight * deal.counterRate }
      : { counterStatus: 'Declined', counterRate: null };

    const updated = await Deal.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: stats for dashboard
const getAdminStats = async (req, res) => {
  try {
    const [pending, accepted, completed, rejected] = await Promise.all([
      Deal.countDocuments({ status: 'Pending' }),
      Deal.countDocuments({ status: 'Accepted' }),
      Deal.countDocuments({ status: 'Completed' }),
      Deal.countDocuments({ status: 'Rejected' }),
    ]);

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [revenueResult, monthRevenueResult] = await Promise.all([
      Deal.aggregate([
        { $match: { status: 'Completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Deal.aggregate([
        { $match: { status: 'Completed', createdAt: { $gte: monthStart } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    const currentMonthRevenue = monthRevenueResult[0]?.total || 0;

    // Top companies by deal value
    const topCompanies = await Deal.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: '$companyName', total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
    ]);

    // Top metals by frequency
    const topMetals = await Deal.aggregate([
      { $group: { _id: '$metalType', count: { $sum: 1 }, total: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Monthly revenue last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Deal.aggregate([
      { $match: { status: 'Completed', createdAt: { $gte: sixMonthsAgo } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({ pending, accepted, completed, rejected, totalRevenue, currentMonthRevenue, topCompanies, topMetals, monthlyRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single deal (for invoice)
const getDeal = async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id };
    const deal = await Deal.findOne(filter);
    if (!deal) return res.status(404).json({ message: 'Deal not found' });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { bookDeal, getMyDeals, getAllDeals, updateDealStatus, counterOffer, respondCounter, getAdminStats, getDeal };
