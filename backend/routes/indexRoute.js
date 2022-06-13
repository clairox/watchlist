const router = require('express').Router();
const passport = require('../auth/passport');
const { pool } = require('../db');

router.post('/login', passport.authenticate('local-login'), (req, res) => {
    const id = req.user.id;
    pool.query('SELECT * FROM user_account WHERE id = $1', [id])
    .then(users => res.status(200).send(users.rows[0]))
    .catch(err => res.status(400).send());
});

module.exports = router;