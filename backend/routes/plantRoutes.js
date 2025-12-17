const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

// list and create plants
router.get('/plants', plantController.getPlants);
router.post('/plants', plantController.addPlant);

module.exports = router;
