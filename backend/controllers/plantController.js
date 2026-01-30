const Plant = require('../models/Plant');

// helper to add days to a date
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// GET /plants - plants for logged-in user
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /plants/:id
exports.getPlant = async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, user: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /plants - create a plant
exports.addPlant = async (req, res) => {
  try {
    const {
      name, species, wateringFrequencyDays, fertilizingFrequencyDays,
      lastWateredDate, lastFertilizedDate, image, notes
    } = req.body;

    // compute next dates
    let nextWater = lastWateredDate ? addDays(lastWateredDate, Number(wateringFrequencyDays || 7)) : addDays(new Date(), Number(wateringFrequencyDays || 7));
    let nextFert = lastFertilizedDate ? addDays(lastFertilizedDate, Number(fertilizingFrequencyDays || 30)) : addDays(new Date(), Number(fertilizingFrequencyDays || 30));

    const plant = new Plant({
      user: req.userId,
      name,
      species,
      wateringFrequencyDays: Number(wateringFrequencyDays || 7),
      fertilizingFrequencyDays: Number(fertilizingFrequencyDays || 30),
      lastWateredDate: lastWateredDate || null,
      lastFertilizedDate: lastFertilizedDate || null,
      nextWateringDate: nextWater,
      nextFertilizingDate: nextFert,
      image,
      notes
    });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /plants/:id - update plant
exports.updatePlant = async (req, res) => {
  try {
    const p = await Plant.findOne({ _id: req.params.id, user: req.userId });
    if (!p) return res.status(404).json({ message: 'Plant not found' });

    // update simple fields
    p.name = req.body.name || p.name;
    p.species = req.body.species || p.species;
    p.wateringFrequencyDays = Number(req.body.wateringFrequencyDays || p.wateringFrequencyDays);
    p.fertilizingFrequencyDays = Number(req.body.fertilizingFrequencyDays || p.fertilizingFrequencyDays);
    p.lastWateredDate = req.body.lastWateredDate || p.lastWateredDate;
    p.lastFertilizedDate = req.body.lastFertilizedDate || p.lastFertilizedDate;
    p.image = req.body.image || p.image;
    p.notes = req.body.notes || p.notes;

    // recalc next dates if last dates or frequencies changed
    if (p.lastWateredDate) {
      p.nextWateringDate = addDays(p.lastWateredDate, p.wateringFrequencyDays);
    } else {
      p.nextWateringDate = addDays(new Date(), p.wateringFrequencyDays);
    }
    if (p.lastFertilizedDate) {
      p.nextFertilizingDate = addDays(p.lastFertilizedDate, p.fertilizingFrequencyDays);
    } else {
      p.nextFertilizingDate = addDays(new Date(), p.fertilizingFrequencyDays);
    }

    await p.save();
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /plants/:id
exports.deletePlant = async (req, res) => {
  try {
    const p = await Plant.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!p) return res.status(404).json({ message: 'Plant not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /plants/:id/water - mark plant as watered today
// This is called when user clicks "Water Now" button
exports.markAsWatered = async (req, res) => {
  try {
    // First, find the plant and make sure it belongs to the logged-in user
    const plant = await Plant.findOne({ _id: req.params.id, user: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    // Update the last watered date to right now
    plant.lastWateredDate = new Date();

    // Calculate when to water next by adding the frequency days
    plant.nextWateringDate = addDays(plant.lastWateredDate, plant.wateringFrequencyDays);

    // Save the updated plant to database
    await plant.save();

    // Create an activity log so we can track this watering event
    const Activity = require('../models/Activity');
    await Activity.create({
      user: req.userId,
      plant: plant._id,
      type: 'watered',
      note: 'Plant watered manually'
    });

    // Send back the updated plant data
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /plants/:id/fertilize - mark plant as fertilized today
// This is called when user clicks "Fertilize Now" button
exports.markAsFertilized = async (req, res) => {
  try {
    // First, find the plant and make sure it belongs to the logged-in user
    const plant = await Plant.findOne({ _id: req.params.id, user: req.userId });
    if (!plant) return res.status(404).json({ message: 'Plant not found' });

    // Update the last fertilized date to right now
    plant.lastFertilizedDate = new Date();

    // Calculate when to fertilize next by adding the frequency days
    plant.nextFertilizingDate = addDays(plant.lastFertilizedDate, plant.fertilizingFrequencyDays);

    // Save the updated plant to database
    await plant.save();

    // Create an activity log so we can track this fertilizing event
    const Activity = require('../models/Activity');
    await Activity.create({
      user: req.userId,
      plant: plant._id,
      type: 'fertilized',
      note: 'Plant fertilized manually'
    });

    // Send back the updated plant data
    res.json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
