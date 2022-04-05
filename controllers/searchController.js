const searchModel = require('../Model/Search');
const candidateModel = require("../Model/Candidate");

class searchController {
    async search(req, res) {
        const list = await searchModel.search(req, res);
        res.send({message: 'Search !!!', list});
    }
}

module.exports = new searchController();