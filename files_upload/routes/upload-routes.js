const router = require('express').Router();
const path = require('path');
const util = require('util');



router.post("/", async (req, res)=>{

    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({message: 'No files were uploaded', url: "error.png"});
        }
        
        const file = req.files.image;
        const fileName = file.name;
        const fileSize = file.size;
        const extension = path.extname(fileName);
        const allowedExtensions = /jpg|jpeg|png|gif/;
        const md5 = file.md5;
        const url = "/uploads/"+ md5 + extension;
        const uploadDirectory = path.join("./public", url);


        if (!allowedExtensions.test(extension)) {
            return res.json({message: "Unsupported extension", url: "error.png"});
        }

        if (fileSize > 2*1024*1024) {
            return res.json({message: "File size exceeds 5Mb", url: "error.png"});
        }

        await util.promisify(file.mv)(uploadDirectory);
           
        res.json({
            message: 'File uploaded!',
            url: url});
        
    } catch (err) {
        console.log (err);
        res.status(500).json({message: err})
    }
});

module.exports = router;