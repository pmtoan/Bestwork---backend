const express = require('express');
const router = express.Router();

const loginController = require('../controllers/authController');

router.post('/login', loginController.auth);

router.get('/logout', loginController.logout);

module.exports = router;