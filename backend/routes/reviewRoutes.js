const express = require('express');
const router = express.Router();
const { getReviews, addReview, getAllReviews, updateReviewStatus, deleteReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                  getReviews);                          // public — approved only
router.post('/',                 protect, addReview);                  // user submit
router.get('/admin',             protect, adminOnly, getAllReviews);    // admin — all
router.put('/:id/status',        protect, adminOnly, updateReviewStatus); // admin approve/reject
router.delete('/:id',            protect, adminOnly, deleteReview);    // admin delete

module.exports = router;
