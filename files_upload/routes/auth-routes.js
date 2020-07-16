const router = require('express').Router();
const passport = require('passport');
const User = require ('../config/user-model');
const genPassword = require('../lib/password-tools').genPassword;

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user, msg: null});
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/auth/login',
                                   failureFlash: true })
);

router.get('/register', (req, res) => {
    res.render('register', { user: req.user });
});

router.post('/register', (req,res) => {
    const {salt, hash} = genPassword(req.body.password);
    const newUser = new User({
        email: req.body.email,
        hash: hash,
        salt: salt,
        
    });
    newUser.save().then(user => console.log(user)).catch(err=>console.log(err));
    res.redirect('/auth/login');


});

module.exports = router;
