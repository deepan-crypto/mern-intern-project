const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');
const auth = require('../middleware/auth');

// list and create plants
router.get('/plants', auth, plantController.getPlants);
router.get('/plants/:id', auth, plantController.getPlant);
router.post('/plants', auth, plantController.addPlant);
router.put('/plants/:id', auth, plantController.updatePlant);
router.delete('/plants/:id', auth, plantController.deletePlant);

module.exports = router;
