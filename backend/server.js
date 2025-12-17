const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

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

// simple cron job - runs every minute (for dev); it looks for overdue tasks and logs an activity.
// in production this schedule could be daily.
const Plant = require('./models/Plant');
const Activity = require('./models/Activity');

cron.schedule('* * * * *', async () => {
  try {
    console.log('Cron: checking overdue tasks');
    const now = new Date();

    // find plants with next watering date in past
    const overdueWater = await Plant.find({ nextWateringDate: { $lt: now } });
    for (const p of overdueWater) {
      // check if we already added overdue today
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

    // find plants with next fertilizing date in past
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
    console.error('Cron error', err);
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});