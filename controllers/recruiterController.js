const recruiterModel = require('../Model/Recruiter');

class recruiterController{
    //-------------------------- Profile --------------------------------\\

    // [GET] /profile
    async get(req, res) {
        const recruiter = await recruiterModel.getProfile(req, res);
        res.send({message: 'GET successfully !!!', recruiter});
    }

    // [GET] /profile/:id
    async update(req, res) {
        await recruiterModel.updateProfile(req, res);
        res.send({message: 'Update successfully !!!'});
    }

    //-------------------------- Job Action --------------------------------\\

    // [POST] /job-create
    async createJob(req, res) {
        await recruiterModel.createJob(req, res);
        res.send({message: 'POST job successfully !!!'});
    }

    // [GET] /job-description/:jobId
    async getJobDescription(req, res) {
        const job = await recruiterModel.getJobDescription(req, res);
        res.send({message: 'GET job description successfully !!!', job});
    }

    // [GET] /job-list
    async getCreatedJobs(req, res) {
        const jobList = await recruiterModel.getCreatedJobs(req, res);
        res.send({message: 'GET job list successfully !!!', jobList});
    }

    // [PUT] /job-description/:jobId
    async editJobDescription(req, res) {
        await recruiterModel.updateJob(req, res);
        res.send({message: 'PUT update job description successfully !!!'});
    }

    //-------------------------- Candidate of a Job --------------------------------\\

    // [GET] /applied-list/:jobId
    async getAppliedList(req, res) {
        const list = await recruiterModel.getAppliedList(req, res);
        res.send({message: 'GET applied list successfully !!!', list});
    }

    // [GET] /candidate-profile/:candidateId
    async getCandidateProfile(req, res) {
        const candidate = await recruiterModel.getCandidateProfile(req, res);
        res.send({message: 'GET candidate profile successfully !!!', candidate});
    }

    //---------------------------------- StarCV ----------------------------------------\\

    // [GET] /star-cv
    async getStarCV(req, res) {
        const candidates = await recruiterModel.starCV(req, res);
        res.send({message: 'GET list star CV successfully !!!', candidates});
    }

}

module.exports = new recruiterController();