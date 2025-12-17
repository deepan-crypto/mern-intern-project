const User = require('../models/User');
const bcrypt = require('bcrypt'); // library for hashing passwords (making them secure)
const jwt = require('jsonwebtoken'); // library for creating login tokens
const JWT_SECRET = process.env.JWT_SECRET || 'secret123';

// REGISTER: Create a new user account
// This function runs when someone fills out the registration form
exports.register = async (req, res) => {
  try {
    // Step 1: Get the data that user typed in the form
    const { name, age, email, password, collegeName } = req.body;

    // Step 2: Check if email is already used by another user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    // Step 3: Hash the password (make it secure so no one can read it)
    // bcrypt.hash takes the plain password and makes it unreadable
    const hashed = await bcrypt.hash(password, 10);

    // Step 4: Create new user in database with hashed password
    const user = new User({ name, age, email, password: hashed, collegeName });
    await user.save();

    // Step 5: Create a token (like a digital key) for the user to login
    // This token will be sent with every future request to prove who they are
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Step 6: Send back the token and user info
    res.status(201).json({ token, id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// LOGIN: Let existing user login
// This function runs when someone tries to login
exports.login = async (req, res) => {
  try {
    // Step 1: Get email and password from login form
    const { email, password } = req.body;

    // Step 2: Find user by email in database
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Step 3: Check if password matches
    // bcrypt.compare checks the typed password against the hashed one in database
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Step 4: Create a token for this login session
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    // Step 5: Send back the token and user info
    res.json({ token, id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
