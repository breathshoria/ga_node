const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/user');

router.get('/addUser', userControllers.getAddPage);

router.post('/addUser', userControllers.addNewTgUser);

router.get('/delete/:id', userControllers.deleteUser);

router.get('/editUser/:id', userControllers.editInitForm);

router.post('/editUser/:id', userControllers.editUser);

router.get('/', userControllers.getAllUsersPage);

module.exports = router;
