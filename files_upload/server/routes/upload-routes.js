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
        
        //define properties of new file
        const file = req.files.image;
        const fileName = file.name;
        const fileSize = file.size;
        const extension = path.extname(fileName);
        const allowedExtensions = /jpg|jpeg|png|gif/i;
        const md5 = file.md5;

        //create path for original file/image
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
           
        //create path for thumbnail 
        const ThumbNailUrl = "/uploads/thumbnail/"+ md5 + extension;
        const ThumbNailUploadDirectory = path.join(__dirname, "../public", ThumbNailUrl);

        //create thumbnail and send the response
        const createThumb = (sendResponse)=> {
            Jimp.read(uploadDirectory)
            .then(thumbnail => {
                return thumbnail
                .resize(170, Jimp.AUTO) // resize
                .quality(100) // set JPEG quality
                .write(ThumbNailUploadDirectory, sendResponse()); // save
            })
            .catch(err => {
                console.error(err);
            });
        }

        //add record of new image in database
        const imageObj = {original: url, thumbnail: ThumbNailUrl, name: fileName };
        User.findOne({ email: req.user.email }, (err, user)=>{
            if (!user.images.some(obg => obg.original == url)) {
                user.images.push(imageObj);
                user.save();
            }
            const sendResponse = ()=>{
                res.json({
                    msg: `${fileName} is uploaded`,
                    error: false,                    
                    user: user.email,
                    images: user.images  
                });
            }

            createThumb(sendResponse);
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

        //define old file path
        const oldFileUrl = req.body.url;
        const oldThumbnailUrl = oldFileUrl.replace('uploads', 'uploads/thumbnail');

        //define properties of modified file
        const file = req.files.image;
        const fileName = file.name;
        const fileSize = file.size;
        const extension = path.extname(fileName);
        const md5 = file.md5;
        const allowedExtensions = /jpg|jpeg|png|gif/i;

        //create modified image path
        const url = "/uploads/"+ md5 + extension;
        const uploadDirectory = path.join(__dirname, "../public", url);

        //create a thumbnail path
        const ThumbNailUrl = "/uploads/thumbnail/"+ md5 + extension;
        const ThumbNailUploadDirectory = path.join(__dirname, "../public", ThumbNailUrl);

        if (fileSize > 5*1024*1024) {
            return res.json({msg: "File size exceeds 5Mb", error: true});
        }

        if (!allowedExtensions.test(extension)) {
            return res.json({msg: "Unsupported extension",  error: true});
        }

        //save modified image and thumbnail
        const saveFile = async (user) => {
            
            // util.promisify(file.mv)(uploadDirectory);
            await util.promisify(file.mv)(uploadDirectory);

            //save thumbnail and send response back
            Jimp.read(uploadDirectory,  (err, thumbnail) => {
                if (err) console.error(err);
                thumbnail
                .resize(170, Jimp.AUTO) // resize
                .quality(100) // set JPEG quality
                .write(ThumbNailUploadDirectory, ()=>{
                    res.json({
                        msg: `${fileName} is modified`,
                        user: user.email,
                        images: user.images     
                    })
                }); 
            });

            //delete old file on server
            const myDir = path.join(__dirname, "../public");
            fs.unlink(myDir + oldFileUrl, (err) => {
                    if (err) throw err;
                    console.log('successfully deleted  '+ myDir + oldFileUrl);
                });

            //delete old thumbnail
            fs.unlink(myDir + oldThumbnailUrl, (err) => {
                if (err) throw err;
                console.log('successfully deleted  '+ myDir + oldThumbnailUrl);
            });
        }

        //find record of old image in DB and replace with new one
        const NewImageObj = {original: url, thumbnail: ThumbNailUrl, name: fileName };

        User.findOne({ email: req.user.email }, (err, user)=>{

            if (user.images.some(obj => obj.original == oldFileUrl)) {
                const index = user.images.findIndex(obj => obj.original == oldFileUrl);
                console.log("index " + index);
                user.images.splice(index,1,NewImageObj);
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