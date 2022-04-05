exports.candidate = function(req,res,next){
    if(req.user) {
        if(req.user.type.trim() !== 'candidate'){
            res.send("You must log in with candidate account !!!");
        } else {
            return next();
        }
    } else {
        res.send('You  have not log in yet !!!');
    }
}

exports.recruiter = function(req,res,next){
    if(req.user) {
        if(req.user.type.trim() !== 'recruiter'){
            res.send("You must log in with recruiter account !!!");
        } else {
            return next();
        }
    } else {
        res.send('You  have not log in yet !!!');
    }
}