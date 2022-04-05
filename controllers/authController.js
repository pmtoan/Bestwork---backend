const passport = require("passport");

class authController {
    // [POST] /login
    auth(req, res, next) {
        passport.authenticate('local', (err, user, info) => {
            if (err) throw err;
            if (!user) res.send(info.message);
            else {
                req.logIn(user, err => {
                    if (err) throw err;
                    res.send({message : 'Successfully Authentication !!',
                        user: {
                            Email : user.Email,
                            Name : user.name,
                            Type: user.User_Type
                        }});
                    console.log("User log in: ");
                    console.log(req.user);
                })
            }
        })(req, res, next);
    }

    // [GET] /logout
    logout(req, res){
        req.logout();
        res.send('Logged out !!!');
    }
}

module.exports = new authController();