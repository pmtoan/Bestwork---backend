const getModel = require('../Model/Get');

class getController{
    // [GET] /interest
    async interest(req, res) {
        const interests = await getModel.getInterest(req, res);
        res.send({message: 'GET interest table successfully !!!', interests});
    }

    // [GET] /skill
    async skill(req, res) {
        const skills = await getModel.getSkill(req, res);
        res.send({message: 'GET skill table successfully !!!', skills});
    }

    // [GET] /job
    async job(req, res) {
        const jobs = await getModel.getJob(req, res);
        res.send({message: 'GET job table successfully !!!', jobs});
    }
}

module.exports = new getController();