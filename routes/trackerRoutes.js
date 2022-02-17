const express = require('express');

const router = express.Router();
const trackerControllers = require('../controllers/tracker');

router.post('/sendTrack', trackerControllers.sendTrack);
router.all('/', trackerControllers.processTrack)

module.exports = router;
