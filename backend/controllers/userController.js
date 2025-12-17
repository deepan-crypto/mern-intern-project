const User = require('../models/User');
const bcrypt = require('bcrypt');

// register a new user
exports.register = async (req, res) => {
  try {
    // get data from form
    const { name, age, email, password, collegeName } = req.body;
    // check existing user simply
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    // hash password
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, age, email, password: hashed, collegeName });
    await user.save();
    // return simple user info (no password)
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    // simple success response
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
