const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  type: { type: String, required: true }, // 'watered' | 'fertilized' | 'overdue_watering' | 'overdue_fertilizing'
  date: { type: Date, default: Date.now },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
