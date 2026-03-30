const express = require('express');
const router = express.Router();
const { bookDeal, getMyDeals, getAllDeals, updateDealStatus, counterOffer, respondCounter, getAdminStats, getDeal } = require('../controllers/dealController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',                    protect, bookDeal);
router.get('/my',                   protect, getMyDeals);
router.get('/admin/stats',          protect, adminOnly, getAdminStats);
router.get('/',                     protect, adminOnly, getAllDeals);
router.get('/:id',                  protect, getDeal);
router.put('/:id/status',           protect, adminOnly, updateDealStatus);
router.put('/:id/counter',          protect, adminOnly, counterOffer);
router.put('/:id/respond-counter',  protect, respondCounter);

module.exports = router;
