const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner
  name: { type: String, required: true },
  species: { type: String }, // plant type/species
  wateringFrequencyDays: { type: Number, default: 7 }, // number of days
  fertilizingFrequencyDays: { type: Number, default: 30 },
  lastWateredDate: { type: Date },
  lastFertilizedDate: { type: Date },
  nextWateringDate: { type: Date },
  nextFertilizingDate: { type: Date },
  image: { type: String }, // base64 or URL (simple)
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
