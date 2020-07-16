const router = require('express').Router();
const isAuth = require('../lib/middlware');


router.get('/', isAuth, (req, res) => {
    res.render('profile', { user: req.user });
});

module.exports = router;
