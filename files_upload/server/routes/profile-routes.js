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

//=====================================DELETE IMAGE
router.delete('/delete', (req,res) => {
    //delete record from database
    let imgToDelete = req.body.image;
    console.log('imgToDelete ' + imgToDelete)
    User.findOne({email : req.user.email},(err,user) => {
        // console.log(user);
        const index = user.images.findIndex(obj => obj.original == imgToDelete);
        user.images.splice(index,1);
        user.save();
        res.json({
            msg: "The image has been deleted",
            user: user.email,
            images: user.images     
        })

        // delete original file from server
        const myDir = path.join(__dirname, "../public");
        fs.unlink(myDir + imgToDelete, (err) => {
                if (err && err.code =='ENOENT') console.log(err) ;
                console.log('originl image is successfully deleted  '+ myDir + imgToDelete);
            });

        // delete thumbnail copy from the server
        const thumbnailToDel = imgToDelete.replace('/uploads','/uploads/thumbnail');
        console.log ('tumbnail to delete ' + thumbnailToDel)
        fs.unlink(myDir + thumbnailToDel, (err) => {
                if (err && err.code =='ENOENT') console.log(err) ;
                console.log('thumbnail is successfully deleted  '+ myDir + thumbnailToDel);
            });

    });



})

module.exports = router;
