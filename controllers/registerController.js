const accountModel = require('../Model/Account');

class registerController{
    // [POST] /register
    async register(req, res){
        const user = await accountModel.createAccount(req, res);

        if(user === -1){
            res.send({message: 'Email is existing !!!'});
        } else if(user === -2){
            res.send({message: 'Password don\'t match !!!'});
        }else{
            await accountModel.createInfo(user, req);
            res.send({message: 'Register successfully !!!'})
        }
    }
}

module.exports = new registerController();