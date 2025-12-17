const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); // allow frontend at different port

// connect to MongoDB (simple local default)
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_intern';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// routes
const userRoutes = require('./routes/userRoutes');
const plantRoutes = require('./routes/plantRoutes');

app.use('/api', userRoutes);
app.use('/api', plantRoutes);

// simple root
app.get('/', (req, res) => {
  res.send('Simple MERN backend');
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});