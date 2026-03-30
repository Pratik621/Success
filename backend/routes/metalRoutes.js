const express = require('express');
const router = express.Router();
const { getMetals, addMetal, updateMetal, deleteMetal, getPriceHistory, getAllPriceHistory } = require('../controllers/metalController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',                    getMetals);
router.post('/',                   protect, adminOnly, addMetal);
router.put('/:id',                 protect, adminOnly, updateMetal);
router.delete('/:id',              protect, adminOnly, deleteMetal);
router.get('/price-history/all',   protect, getAllPriceHistory);
router.get('/:id/price-history',   protect, getPriceHistory);

module.exports = router;
