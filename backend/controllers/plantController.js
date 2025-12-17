const Plant = require('../models/Plant');

// GET /plants - return all plants
exports.getPlants = async (req, res) => {
  try {
    const plants = await Plant.find().sort({ createdAt: -1 });
    res.json(plants);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /plants - add a new plant
exports.addPlant = async (req, res) => {
  try {
    // take fields from request body
    const { name, scientificName, category, water, light, temperature } = req.body;
    const plant = new Plant({ name, scientificName, category, water, light, temperature });
    await plant.save();
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
