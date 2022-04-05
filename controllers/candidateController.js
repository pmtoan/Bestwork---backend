const candidateModel = require('../Model/Candidate');

class candidateController{
    // [GET] /profile
    async update(req, res) {
        await candidateModel.updateProfile(req, res);
        res.send({message: 'Update successfully !!!'});
    }

    //[PATCH] /profile
    async setPublic(req, res) {
        await candidateModel.setPublic(req, res);
        res.send({message: 'Set Public CV successfully !!!'});
    }

    // [PUT] /profile
    async get(req, res) {
        const candidate = await candidateModel.getProfile(req, res);
        res.send({message: 'GET successfully !!!', candidate});
    }

    async apply(req, res) {
        await candidateModel.apply(req, res);
        res.send({message: 'Apply job successfully !!!'});
    }

    async appliedList(req, res) {
        const list = await candidateModel.appliedList(req, res);
        res.send({message: 'Get Applied list successfully !!!', list});
    }

    async jobList(req, res) {
        const list = await candidateModel.jobList(req, res);
        res.send({message: 'Get job list successfully !!!', list});
    }

    async jobDescription(req, res) {
        const job = await candidateModel.jobDescription(req, res);
        res.send({message: 'Get job description successfully !!!', job});
    }
}

module.exports = new candidateController();