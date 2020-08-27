const router = require('express').Router();
const path = require('path');
const util = require('util');
const fs = require('fs');
const User = require('../config/user-model');
const isAuth = require('../lib/middlware');

// router.get('/', (req,res) =>

//     res.json({
//         user: req.user ? req.user.email : null,
//         images: req.user ? req.user.images : []      
//     })
 
// );
//========================================upload images on server
router.post("/images", isAuth, async (req, res)=>{
    try {
        console.log("=================================req.body=======================================");
        console.log(req.body);
        console.log("=================================req.files=======================================");
        console.log(req.files);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({msg: 'No files were uploaded', url: "error.png"});
        }
        
        const file = req.files.image;
        const fileName = file.name;
        const fileSize = file.size;
        const extension = path.extname(fileName);
        const allowedExtensions = /jpg|jpeg|png|gif/i;
        const md5 = file.md5;
        const url = "/uploads/"+ md5 + extension;
        const uploadDirectory = path.join(__dirname, "../public", url);

        if (fileSize > 5*1024*1024) {
            return res.json({msg: "File size exceeds 5Mb", error: true});
        }

        if (!allowedExtensions.test(extension)) {
            return res.json({msg: "Unsupported extension",  error: true});
        }



        //create folder and file
        const myDir = path.join(__dirname, "../public", 'uploads');
        const mkdir = util.promisify(fs.mkdir);
            await mkdir(myDir)
            .catch((err) => {
                if (err && !err.code == 'EEXIST') console.log(err)
            });
       
        await util.promisify(file.mv)(uploadDirectory);
           


        User.findOne({ email: req.user.email }, (err, user)=>{
            if (!user.images.includes(url)) {
                user.images.push(url);
                user.save();
            }

            res.json({
                msg: `${fileName} is uploaded`,
                error: false  
            });

        });



    } catch (err) {
        console.log (err);
        res.json({
            msg: err,
            error: true
        })
    }
});

//===============================modify/overwrite image on server

router.patch("/images", isAuth, async (req, res)=>{
    try {
        // console.log("=================================req.body=======================================");
        // console.log(req.body);
        // console.log("=================================req.files=======================================");
        // console.log(req.files);

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.json({msg: 'No files were uploaded', url: "error.png"});
        }


        const oldFileName = req.body.url;
        const file = req.files.image;
        const fileName = file.name;
        const fileSize = file.size;
        const extension = path.extname(fileName);
        
        const allowedExtensions = /jpg|jpeg|png|gif/i;
        const md5 = file.md5;
        const url = "/uploads/"+ md5 + extension;
        const uploadDirectory = path.join(__dirname, "../public", url);

        if (fileSize > 5*1024*1024) {
            return res.json({msg: "File size exceeds 5Mb", error: true});
        }

        if (!allowedExtensions.test(extension)) {
            return res.json({msg: "Unsupported extension",  error: true});
        }

        const saveFile = async ()=>{
            //save new file on server
            await util.promisify(file.mv)(uploadDirectory);

            //delete old file on server
            const myDir = path.join(__dirname, "../public");
            fs.unlink(myDir + oldFileName, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted  '+ myDir + oldFileName);
                });
        }

        User.findOne({ email: req.user.email }, (err, user)=>{
            console.log("user findone")
            if (user.images.includes(oldFileName)) {
                const index = user.images.indexOf(oldFileName);
                user.images.splice(index,1,url);
                user.save();
                saveFile();  
                res.json({
                    msg: "The file is modified",
                    user: user.email,
                    images: user.images     
                })
            }

        });



    } catch (err) {
        console.log (err);
        res.json({
            msg: err,
            error: true
        })
    }
});


module.exports = router;