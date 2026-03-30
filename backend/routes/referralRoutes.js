const express = require('express');
const router = express.Router();
const { createReferral, getMyReferrals, getAllReferrals, updateReferralStatus } = require('../controllers/referralController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',           protect, createReferral);
router.get('/my',          protect, getMyReferrals);
router.get('/',            protect, adminOnly, getAllReferrals);
router.put('/:id/status',  protect, adminOnly, updateReferralStatus);

module.exports = router;
