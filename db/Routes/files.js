const express = require('express');
const router = new express.Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuid } = require('uuid');
const { resolveSoa } = require('dns');
const auth = require('../services/auth');


let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName)
    },
});

let upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 100 }, }).single('myfile'); //100mb


// http://localhost:3000/api/files
router.post('/api/files', auth, (req, res) => {
    // store file in Upload folder
    upload(req, res, async (err) => {
        // if there is no file uplaoded by client (validating)
        // error handling
        if (err) {
            return res.status(500).send({ error: err.message });
        }
        // console.log(req.user);
        if(req.user === undefined)
        {
            return res.send('nhi hua');
        }
        // creating document
        const file = new File({
            filename: req.file.filename,
            uuid: uuid(),
            path: req.file.path,
            size: req.file.size,
            useridd: req.user._id.toString()
        });
        // stroing document in db
        const response = await file.save();
        // sending response
        res.status(201).json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    });

    // provid in link in res.
});


router.post('/api/files/send', async (req, res) => {
    console.log(req.body);
    if (!req.body) {
        return res.send("Kachu nahi ayo");
    }
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailFrom || !emailTo) {
        return res.status(422).send({ error: "All fields are required" });
    }
    const file = await File.findOne({ uuid });
    if (!file) {
        return res.send('wrong uuid');
    }
    if (file.sender) {
        return res.status(422).send({ error: 'Email already sent..' });
    }
    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await file.save();


    // now sending email...
    const sendEmail = require('../services/emailService');
    sendEmail({
        from: file.sender,
        to: file.receiver,
        subject: 'ShareKaro File Sharing',
        text: `${file.sender} shared a file with you`,
        html: require('../services/emailTemplate')({
            emailFrom: file.sender,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1024) + ' KB',
            expires: '24 hours'
        })
    });
    return res.send({ success: 'true' });
});

router.get('/home',auth,(req,res) => {
    res.render('home');
})

router.get('/links',auth,async (req,res)=>{
    try{
        const list = await File.find({useridd: req.user._id.toString()});
        // console.log(list);
        const listData = await list.map((ele)=>{
            return `${process.env.APP_BASE_URL}/files/${ele.uuid}`
        });
        res.render('links',{listData});
    }
    catch(err){
        res.status(400).send('oops something went wrong..');
    }
});

module.exports = router;
