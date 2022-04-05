const express = require('express');
const router = express.Router();


const candidateController = require('../controllers/candidateController');

router.get('/profile', candidateController.get);
router.put('/profile', candidateController.update);
router.patch('/profile', candidateController.setPublic);

router.post('/apply', candidateController.apply);
router.get('/job-applied', candidateController.appliedList);
router.get('/job-list', candidateController.jobList);
router.get('/job-description/:jobId', candidateController.jobDescription);

module.exports = router;