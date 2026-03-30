const express = require('express');
const router = express.Router();
const { getContact, updateContact } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getContact);
router.put('/', protect, adminOnly, updateContact);

module.exports = router;
