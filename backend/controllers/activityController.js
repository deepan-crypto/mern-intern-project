const Activity = require('../models/Activity');

// GET /activities - list for user, optional plant filter
exports.getActivities = async (req, res) => {
  try {
    const filter = { user: req.userId };
    if (req.query.plantId) filter.plant = req.query.plantId;
    if (req.query.type) filter.type = req.query.type;
    const activities = await Activity.find(filter).sort({ date: -1 });
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /activities - create (basic)
exports.addActivity = async (req, res) => {
  try {
    const { plant, type, date, note } = req.body;
    const act = new Activity({ user: req.userId, plant, type, date: date || Date.now(), note });
    await act.save();
    res.status(201).json(act);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
