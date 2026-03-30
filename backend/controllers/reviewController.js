const Review = require('../models/Review');

// Public: only approved reviews shown to users
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: submit review — goes to Pending
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || !comment)
      return res.status(400).json({ message: 'Rating and comment are required' });

    const review = await Review.create({
      userId:      req.user._id,
      companyName: req.user.companyName,
      rating,
      comment,
      status:      'Pending',
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get all reviews (all statuses)
const getAllReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: approve or reject
const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status))
      return res.status(400).json({ message: 'Invalid status' });

    const review = await Review.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getReviews, addReview, getAllReviews, updateReviewStatus, deleteReview };
