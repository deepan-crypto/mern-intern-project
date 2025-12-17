const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  scientificName: { type: String },
  category: { type: String },
  water: { type: String },
  light: { type: String },
  temperature: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Plant', plantSchema);
