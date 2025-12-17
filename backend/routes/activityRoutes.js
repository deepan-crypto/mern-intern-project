const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

router.get('/activities', auth, activityController.getActivities);
router.post('/activities', auth, activityController.addActivity);

module.exports = router;
