const express = require('express');

const router = express.Router();
const trackerControllers = require('../controllers/tracker');

router.post('/sendTrack', trackerControllers.sendTrack);
router.get('/getStats', trackerControllers.getStats);
router.all('/', trackerControllers.processTrack)

module.exports = router;
