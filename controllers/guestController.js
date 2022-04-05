const guestModel = require('../Model/Guest');

class guestController{
    async jobList(req, res) {
        const list = await guestModel.jobList(req, res);
        res.send({message: 'Get job list successfully !!!', list});
    }

    async jobDescription(req, res) {
        const job = await guestModel.jobDescription(req, res);
        res.send({message: 'Get job description successfully !!!', job});
    }
}

module.exports = new guestController();