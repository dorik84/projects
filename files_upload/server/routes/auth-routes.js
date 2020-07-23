const router = require('express').Router();
const passport = require('passport');
const User = require ('../config/user-model');
const genPassword = require('../lib/password-tools').genPassword;
const { body, validationResult } = require('express-validator');

const validator = [
    body('email')
        .notEmpty()
        .trim()
        .normalizeEmail({lowercase: true})
        .isEmail()
        .isLength({ min: 5, max: 50 })
        .withMessage('Email should be a valid email address with min character 5 and max 50'),
    body('password')
        .notEmpty()
        .trim()
        .blacklist('<>')
        .isLength({ min: 6, max: 25 })
        .withMessage('Password must contain min character 6 and max character 25. And exclude next symbols <>')
];

//============================================get routes
// auth login
router.get('/login', (req, res) => {
    // res.render('login', { user: req.user, msg: null});
    res.json(    {
        page: "login",
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []     
    })
});

// auth logout
router.get('/logout', async (req, res) => {
    await req.logout();
    res.json(  {
        page: "home",
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []      
    })

});

router.get('/register', (req, res) => {
    // res.render('register', { user: req.user });
    res.json(    {
        page: "register",
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []           
    })
});

//=================================================post routes

router.post('/login', validator, (req,res,next) => {
    const errors = validationResult(req);
    console.log (req.body)
    if (!errors.isEmpty()) 
        return res.json({ errors: errors.array()[0].msg });
    else 
        next();
    },

    passport.authenticate('local'),
        // { successRedirect: '/',
        // failureRedirect: '/auth/login',
        // failureFlash: true })
        (req,res) => {
            res.json(    {
                page: "home",
                user: req.user ? req.user.email : null,
                images: req.user ? req.user.images : []      
            })
        }
);


router.post('/register', validator, (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array()[0].msg });
        }

    User.findOne({email: req.body.email}, (err,user) =>{
        // console.log(user);
        if (user) 
            return res.json({msg: "this email is in use already"})
        else {
            const {salt, hash} = genPassword(req.body.password);
            const newUser = new User({
                email: req.body.email,
                hash: hash,
                salt: salt,
            });
    
            newUser.save().then(user => console.log(user)).catch(err => console.log(err));
            // res.redirect('/auth/login');
            res.json(    {
                page: "login",
                user: req.user ? req.user.email : null,
                images: req.user ? req.user.images : []      
            })
        }
    });

    
});

module.exports = router;
