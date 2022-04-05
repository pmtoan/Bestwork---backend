const express = require('express');
const router = express.Router();


const recruiterController = require('../controllers/recruiterController');

router.get('/profile', recruiterController.get);
router.put('/profile', recruiterController.update);

router.post('/job-create', recruiterController.createJob);
router.get('/job-description/:jobId', recruiterController.getJobDescription);
router.put('/job-description/:jobId', recruiterController.editJobDescription);

router.get('/job-list', recruiterController.getCreatedJobs);

router.get('/applied-list/:jobId', recruiterController.getAppliedList); //get list candidate applied of job(:id)
router.get('/candidate-profile/:candidateId', recruiterController.getCandidateProfile);

router.get('/star-cv', recruiterController.getStarCV);

module.exports = router;