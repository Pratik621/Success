const express = require('express');
const router = express.Router();
const { createReminder, getMyReminders, deleteMyReminder, getAdminReminders, markReminderDone } = require('../controllers/reminderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',           protect, createReminder);
router.get('/my',          protect, getMyReminders);
router.delete('/:id',      protect, deleteMyReminder);
router.get('/admin',       protect, adminOnly, getAdminReminders);
router.put('/:id/done',    protect, adminOnly, markReminderDone);

module.exports = router;
