const express = require('express');
const router = express.Router();

const guestController = require('../controllers/guestController');

router.get('/job-list', guestController.jobList);
router.get('/job-description/:jobId', guestController.jobDescription);

module.exports = router;