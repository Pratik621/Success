const Reminder = require('../models/Reminder');

// User: create reminder
const createReminder = async (req, res) => {
  try {
    const { metalType, pickupDate, note, phone } = req.body;
    if (!metalType || !pickupDate || !phone)
      return res.status(400).json({ message: 'Metal type, phone and pickup date are required' });

    const reminder = await Reminder.create({
      userId:      req.user._id,
      companyName: req.user.companyName,
      phone:       phone || req.user.phone,
      metalType,
      pickupDate:  new Date(pickupDate),
      note,
    });
    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: get own reminders
const getMyReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id }).sort({ pickupDate: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User: delete own reminder
const deleteMyReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: get reminders within next N days (based on real date)
// Logic: today = Monday → show up to Friday (5 days ahead)
//        today = Friday → show up to Saturday (1 day ahead)
//        other days → show up to 6 days ahead (capped at next Friday or Saturday)
const getAdminReminders = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // day: 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
    const day = now.getDay();

    // Days ahead to show:
    // Mon(1)→Fri(5): 4 days ahead  | Tue(2)→Fri: 3 | Wed(3)→Fri: 2
    // Thu(4)→Fri: 1 | Fri(5)→Sat: 1 | Sat(6)→next Fri: 6 | Sun(0)→Fri: 5
    const daysAheadMap = { 0: 5, 1: 4, 2: 3, 3: 2, 4: 1, 5: 1, 6: 6 };
    const daysAhead = daysAheadMap[day];

    const rangeEnd = new Date(todayStart);
    rangeEnd.setDate(rangeEnd.getDate() + daysAhead);
    rangeEnd.setHours(23, 59, 59, 999);

    const reminders = await Reminder.find({
      pickupDate: { $gte: todayStart, $lte: rangeEnd },
      status: 'Pending',
    }).sort({ pickupDate: 1 });

    res.json({ reminders, rangeEnd, daysAhead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: mark reminder as done
const markReminderDone = async (req, res) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { status: 'Done' },
      { new: true }
    );
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createReminder, getMyReminders, deleteMyReminder, getAdminReminders, markReminderDone };
