const express = require('express');
const router = new express.Router();
const File = require('../models/file');
const path = require('path');

router.get('/files/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        if (!file) {
            return res.render('download', { error: 'Link has been either expired or not exist' });
        }
        else {
            // console.log(file.uuid);
            return res.render('download', {
                uuid: file.uuid,
                filename: file.filename,
                filesize: file.size,
                download: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`,
                error: null
                // http://localhost:3000/files/download/uuid.
            });
        }
    }
    catch (err) {
        return res.render('download', { error: 'Somthing went wrong' });
    }
});

router.get('/files/download/:uuid', async (req, res) => {
    console.log(req.params.uuid);
    try{
        const file = await File.findOne({uuid: req.params.uuid});
        if(!file)
        {
            return res.render('download',{
                error: 'Download Link has been Expired'
            });
        }
        const FilePath = path.join(__dirname,`../../${file.path}`);
        // console.log(FilePath);
        // res.send('milgyo ji');
        res.download(FilePath);
    }   
    catch(err){
        return res.render('download',{
            error: `No response ${err}`
        })
    }
})

module.exports = router;