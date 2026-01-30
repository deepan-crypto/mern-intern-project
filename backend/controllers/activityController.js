const Activity = require('../models/Activity');

// GET /activities - get list of activities for the logged-in user
// Activities are things like "watered", "fertilized", "overdue_watering"
// This function can filter by plantId or type using query parameters
exports.getActivities = async (req, res) => {
  try {
    // Start with basic filter: only show activities for this user
    const filter = { user: req.userId };

    // If URL has ?plantId=123, only show activities for that plant
    if (req.query.plantId) filter.plant = req.query.plantId;

    // If URL has ?type=watered, only show that type
    if (req.query.type) filter.type = req.query.type;

    // Find activities from database, newest first
    const activities = await Activity.find(filter).sort({ date: -1 }).populate('plant', 'name');
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /activities - create a new activity (basic function)
// This is used to manually add an activity if needed
exports.addActivity = async (req, res) => {
  try {
    const { plant, type, date, note } = req.body;

    // Create new activity in database
    const act = new Activity({
      user: req.userId,
      plant,
      type,
      date: date || Date.now(),
      note
    });
    await act.save();

    res.status(201).json(act);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
