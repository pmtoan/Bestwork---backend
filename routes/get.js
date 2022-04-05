const express = require('express');
const router = express.Router();

const getController = require('../controllers/getController');

router.get('/interest', getController.interest);
router.get('/skill', getController.skill);
router.get('/job', getController.job);

module.exports = router;