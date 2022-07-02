const router = require('express').Router();
const passport = require('../auth/passport');

router.post('/signup', passport.authenticate('local-signup'), (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    }
    else {
        res.status(500).send();
    }
})

router.post('/login', passport.authenticate('local-login'), (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    }
    else {
        res.status(500).send();
    }
});

router.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(err => {
            res.clearCookie('connect.sid', { path: '/' }).status(200).send();
        })
}   );
})

module.exports = router;