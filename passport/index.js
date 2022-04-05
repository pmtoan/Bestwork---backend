var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;

const {connect, sql}= require('../Model/connect');
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function(username, password, done) {
        const pool = await connect;
        let sqlString = '';

        const result = await pool.request().query(`SELECT * FROM Account WHERE Account.Email='${username}'`);
        const user = result.recordset[0];

        if (!user) {
            return done(null, false, {message: 'Email not exist'});
        }

        const isValid = await bcrypt.compare(password,user.Password.trim());

        if (!isValid) {
            return done(null, false, {message: 'Incorrect password'});
        }

        if(user.User_Type.trim() === 'candidate'){
            sqlString = `SELECT * FROM Candidate
                         WHERE Account_ID = '${user.Account_ID}'`;

            const result = await pool.request().query(sqlString);
            user.user_id = result.recordset[0].Candidate_ID;
            user.name = result.recordset[0].Candidate_Name;

        } else if (user.User_Type.trim() === 'recruiter'){
            sqlString = `SELECT * FROM Recruiter
                         WHERE Account_ID = '${user.Account_ID}'`;

            const result = await pool.request().query(sqlString);
            user.user_id = result.recordset[0].Recruiter_ID;
            user.name = result.recordset[0].Recruiter_Name;
        }

        return done(null, user);
    }
));

passport.serializeUser(function(user, done) {
    done(null, {
        account_id: user.Account_ID,
        user_id: user.user_id,
        name: user.name,
        email : user.Email,
        type: user.User_Type
    });
});

passport.deserializeUser(async function(user, done) {
    done(null, user);
});

module.exports = passport;