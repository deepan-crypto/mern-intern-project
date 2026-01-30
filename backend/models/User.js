const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  collegeName: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
