const router = require('express').Router();
const path = require('path');
const util = require('util');
const fs = require('fs');
const User = require('../config/user-model');
const isAuth = require('../lib/middlware');
const Jimp = require('jimp');
 

//========================================upload images on server
router.post("/images", isAuth, async (req, res)=>{
    try {
    

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



        //create folder and save the original file/image
        const myDir = path.join(__dirname, "../public", 'uploads');
        const mkdir = util.promisify(fs.mkdir);
            await mkdir(myDir)
            .catch((err) => {
                if (err && !err.code == 'EEXIST') console.log(err)
            });
       
        await util.promisify(file.mv)(uploadDirectory);
           
        //create and save a thumbnail version
        const ThumbNailUrl = "/uploads/thumbnail/"+ md5 + extension;
        const ThumbNailUploadDirectory = path.join(__dirname, "../public", ThumbNailUrl);

    //save thumbnail and send the response
        const SaveSendRes = (sendRes)=> {
            Jimp.read(uploadDirectory)
            .then(thumbnail => {
                return thumbnail
                .resize(170, Jimp.AUTO) // resize
                .quality(100) // set JPEG quality
                .write(ThumbNailUploadDirectory, sendRes()); // save
            })
            .catch(err => {
                console.error(err);
            });
        }

        User.findOne({ email: req.user.email }, (err, user)=>{
            if (!user.images.includes(url)) {
                user.images.push(url);
                user.save();
            }
            const sendRes = ()=>{
                res.json({
                    msg: `${fileName} is uploaded`,
                    error: false,                    
                    user: user.email,
                    images: user.images  
                });
            }

            SaveSendRes(sendRes);
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

        const saveFile =  (user)=>{
            //save new file on server
             util.promisify(file.mv)(uploadDirectory);

            //create a thumbnail
            const ThumbNailUrl = "/uploads/thumbnail/"+ md5 + extension;
            const ThumbNailUploadDirectory = path.join(__dirname, "../public", ThumbNailUrl);

            Jimp.read(uploadDirectory,  (err, thumbnail) => {
                if (err) console.error(err);
                thumbnail
                .resize(170, Jimp.AUTO) // resize
                .quality(100) // set JPEG quality
                .write(ThumbNailUploadDirectory, ()=>{
                    res.json({
                        msg: "The file is modified",
                        user: user.email,
                        images: user.images     
                    })
                }); 
            });


            //delete old file on server
            const myDir = path.join(__dirname, "../public");
            fs.unlink(myDir + oldFileName, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted  '+ myDir + oldFileName);
                });

            //delete old thumbnail
            const oldThumbnailName = oldFileName.replace('uploads', 'uploads/thumbnail')
            fs.unlink(myDir + oldThumbnailName, (err) => {
                if (err) throw err;
                console.log('successfully deleted  '+ myDir + oldThumbnailName);
            });
        }

        User.findOne({ email: req.user.email }, (err, user)=>{

            if (user.images.includes(oldFileName)) {
                const index = user.images.indexOf(oldFileName);
                user.images.splice(index,1,url);
                user.save();
                saveFile(user);  
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