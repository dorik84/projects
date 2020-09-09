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
    res.json({
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []     
    })
});

// auth logout
router.get('/logout', async (req, res) => {
    await req.logout();
    res.json({
        msg: "You have logged out",   
        user: null,
        images:[]
    })

});

router.get('/register', (req, res) => {
    // res.render('register', { user: req.user });
    res.json(    {
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []           
    })
});

//=================================================post routes

router.post('/login', validator, (req,res,next) => {
    //validator error handler
    const errors = validationResult(req);
    console.log (req.body)
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.json({ errors: errors.array() });   
    }
    next()
},

    passport.authenticate('local'), 
    (req,res) => {
        return res.json({
            msg: "You have logged in successfully" ,
            user: req.user.email,
            images: req.user.images      
        })
    
    }
);


router.post('/register', validator, (req,res) => {
    //validator error handler
    const errors = validationResult(req);
    console.log (req.body)
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.json({ errors: errors.array() });   
    }

    User.findOne({email: req.body.email}, (err,user) =>{

        if (user) 
            return res.json({msg: "this email is in use already"})
        else {
            const {salt, hash} = genPassword(req.body.password);
            const newUser = new User({
                email: req.body.email,
                hash: hash,
                salt: salt,
            });
    
            newUser
                .save()
                .then(user => console.log(user))
                .catch(err => console.log(err));

            res.json({
                msg: "Your account has been successfully created"   
            })
        }
    });

    
});

module.exports = router;
