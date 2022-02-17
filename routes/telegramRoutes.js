const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/telegrams');

router.post('/addTelegram', userControllers.addNewTgUser);
router.get('/editTelegram/:id', userControllers.editInitForm);
router.post('/editTelegram/:id', userControllers.editTelegram);
router.get('/', userControllers.getAllTelegrams);
router.delete('/:id', userControllers.deleteTelegram);

module.exports = router;
