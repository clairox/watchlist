const { pgPool } = require('../db');

const router = require('express').Router();

router.get('/', (req, res) => {
    const id = req.session.passport?.user
    if (id) {
        pgPool.query('SELECT id, email, firstName, lastName FROM user_account WHERE id = $1', [id])
            .then(users => {
                const user = users.rows[0];
                res.status(200).json(user ? {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstname,
                    lastName: user.lastname
                } : null)
            })
    }
    else {
        res.status(200).send(null);
    }
});

router.get('/checkEmailAvailability/:email', (req, res) => {
    const email = req.params.email;
    
    if (email) {
        pgPool.query('SELECT email FROM user_account WHERE email = $1', [email])
            .then(emails => {
                if (emails.rows[0]) {
                    res.status(200).send(false);
                }
                else {
                    res.status(200).send(true);
                }

            })
    }
    else {
        res.status(500).send();
    }
})

module.exports = router;