const express = require('express');

const router = express.Router();
const userControllers = require('../controllers/users');


router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.get('/refresh', userControllers.refreshToken);
router.get('/user', userControllers.getUser);
router.get('/', userControllers.getWelcome);

module.exports = router;
