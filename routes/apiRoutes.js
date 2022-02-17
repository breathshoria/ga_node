const express = require('express');

const router = express.Router();
const apiControllers = require('../controllers/api');

router.post('/notify', apiControllers.notify);
router.post('/sendTasks', apiControllers.sendTasks);

module.exports = router;
