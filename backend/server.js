const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// try to load node-cron, but don't crash if it's not installed
let cron = null;
try {
  cron = require('node-cron'); // used for scheduled checks
} catch (err) {
  console.warn('node-cron not installed — falling back to setInterval. Run `cd backend && npm install` to add node-cron.');
}

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
const activityRoutes = require('./routes/activityRoutes');

app.use('/api', userRoutes);
app.use('/api', plantRoutes);
app.use('/api', activityRoutes);

// simple root
app.get('/', (req, res) => {
  res.send('Simple MERN backend with cron job');
});

// simple cron-like job that checks overdue tasks
const Plant = require('./models/Plant');
const Activity = require('./models/Activity');

async function checkOverdue() {
  try {
    console.log('Cron/Fallback: checking overdue tasks');
    const now = new Date();

    const overdueWater = await Plant.find({ nextWateringDate: { $lt: now } });
    for (const p of overdueWater) {
      const start = new Date();
      start.setHours(0,0,0,0);
      const existing = await Activity.findOne({
        plant: p._id,
        type: 'overdue_watering',
        date: { $gte: start }
      });
      if (!existing) {
        await Activity.create({ user: p.user, plant: p._id, type: 'overdue_watering', note: 'Auto detected overdue watering' });
      }
    }

    const overdueFert = await Plant.find({ nextFertilizingDate: { $lt: now } });
    for (const p of overdueFert) {
      const start = new Date();
      start.setHours(0,0,0,0);
      const existing = await Activity.findOne({
        plant: p._id,
        type: 'overdue_fertilizing',
        date: { $gte: start }
      });
      if (!existing) {
        await Activity.create({ user: p.user, plant: p._id, type: 'overdue_fertilizing', note: 'Auto detected overdue fertilizing' });
      }
    }
  } catch (err) {
    console.error('Cron/Fallback error', err);
  }
}

// schedule the checking function using node-cron if available, otherwise use setInterval as fallback
if (cron && typeof cron.schedule === 'function') {
  // every minute for dev (in production you could change to daily)
  cron.schedule('* * * * *', checkOverdue);
} else {
  // fallback: run every minute
  setInterval(checkOverdue, 60 * 1000);
}

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});