const router = require('express').Router();
const isAuth = require('../lib/middlware');
const User = require('../config/user-model');
const fs = require('fs');
const path = require('path');



router.get('/', isAuth, (req, res) => {
    // res.render('profile', { user: req.user });
    res.json({
        msg: null,
        user: req.user ? req.user.email : null,
        images: req.user ? req.user.images : []      
    })
});

router.delete('/delete', (req,res) => {
    let imgToDelete = req.body.image;
    User.findOne({email : req.user.email},(err,user) => {
        console.log(user);
        const index = user.images.indexOf(imgToDelete);
        user.images.splice(index,1);
        user.save();
        res.json({
            msg: "The image has been deleted",
            user: user.email,
            images: user.images     
        })
    });

    const myDir = path.join(__dirname, "../public");
    fs.unlink(myDir + imgToDelete, (err) => {
            if (err) throw err;
            console.log('successfully deleted  '+ myDir + imgToDelete);
        });

})

module.exports = router;
