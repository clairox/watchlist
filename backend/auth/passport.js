const passport = require('passport');
const init = require('./init');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../db');

passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true,
        session: false
    },
    (req, email, password, next) => {
        pool.query('SELECT * FROM user_account WHERE email = $1', [email], (err, users) => {
            const user = users.rows[0]
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(null, false)
            }

            if (!(user.password === password)) {
                return next(null, false)
            }
            else {
                return next(null, user);
            }
        })
    }
));

init();

module.exports = passport;