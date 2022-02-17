const express = require('express');

const router = express.Router();
const apiControllers = require('../controllers/api');
const trackingControllers = require("../controllers/tracker");

router.post('/notify', apiControllers.notify);
router.post('/sendTasks', apiControllers.sendTasks);
router.post('/track', trackingControllers.sendTrack)

module.exports = router;
