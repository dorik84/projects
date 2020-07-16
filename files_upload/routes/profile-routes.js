const router = require('express').Router();
const isAuth = require('../lib/middlware');
const User = require('../config/user-model');


router.get('/', isAuth, (req, res) => {
    res.render('profile', { user: req.user });
});

router.post('/delete', (req,res)=>{
    let imgToDelete = req.body.image;
    User.findOne({email : req.user.email},(err,user) => {
        console.log(user);
        const index = user.images.indexOf(imgToDelete);
        user.images.splice(index,1);
        user.save();
        res.json({images:user.images});
    })
})

module.exports = router;
