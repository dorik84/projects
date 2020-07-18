const router = require('express').Router();
const passport = require('passport');
const User = require ('../config/user-model');
const genPassword = require('../lib/password-tools').genPassword;
const { body, validationResult } = require('express-validator');

const validator = [
    body('email').notEmpty().trim().normalizeEmail().isEmail().isLength({ min: 5, max: 50 }).withMessage('It should be a valid email address with min character 5 and max 50'),
    body('password').notEmpty().isLength({ min: 6, max: 25 }).withMessage('min character 36 and max character 25')
];

// auth login
router.get('/login', (req, res) => {
    res.render('login', { user: req.user, msg: null});
});

// auth logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});


router.post('/login', validator, (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
        return res.json({ errors: errors.array()[0].msg });
    else 
        next();
    },

    passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/auth/login',
                                   failureFlash: true })
);

router.get('/register', (req, res) => {
    res.render('register', { user: req.user });
});



router.post('/register', validator, (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array()[0].msg });
        }

    User.findOne({email: req.body.email}, (err,user) =>{
        console.log(user);
        if (user) 
            return res.json({msg: "this email is in use already"})
        else {
            const {salt, hash} = genPassword(req.body.password);
            const newUser = new User({
                email: req.body.email,
                hash: hash,
                salt: salt,
            });
    
            newUser.save().then(user => console.log(user)).catch(err=>console.log(err));
            res.redirect('/auth/login');
        }
    });

    
});

module.exports = router;
