const express = require('express');
const router = new express.Router();
const Users = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../services/auth');

router.get('/', auth, (req, res) => {
    res.status(200).redirect('/home');
});


// sign - in router 
router.post('/signup', async (req, res) => {
    try {
        if (req.body.password !== req.body.cpassword) {
            return res.status(200).render('register', { msg: "Password and Confirm Password not matched", reg: true });
        }
        const isExist = await Users.findOne({ EmailID: req.body.emailid });
        if (isExist) {
            return res.status(200).render('register', { msg: "Already have an account with this Email ID.", reg: true });
        }
        const document = new Users({
            EmailID: req.body.emailid,
            Password: req.body.password,
            Status: 0
        });
        console.log('data saved');
        const token = await document.generateAuthToken();
        const result = await document.save();
        if (token) {
            console.log(token);
            res.cookie("sharekaroreg", token, {
                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 3)),
                httpOnly: true
            })
            const userid = await result._id;
            // console.log("yep i got the id:",userid.toString());
            const _idd = await userid.toString();

            // now sending email....
            const sendEmail = require('../services/emailService');
            sendEmail({
                from: 'deepaknitd142024@gmail.com',
                to: req.body.emailid,
                subject: 'ShareKaro File Sharing',
                text: "jai shree ram",
                html: require('../services/emailverifytemplate')({
                    emailFrom: req.body.emailid,
                    downloadLink: `${process.env.APP_BASE_URL}/verify/${_idd}`,
                    expires: '24 hours'
                })
            });


            return res.status(201).render('register', { msg: `Verification link is sent to ${req.body.emailid}`, reg: false });
        }
        res.status(400).render('register', { msg: `Unable to store cookies..`, reg: true });
    }
    catch (err) {
        res.status(400).render('register', { msg: 'oops facing problem in register', reg: true });
    }
})

// email - verifcation link router on new registration
router.get('/verify/:_id', async (req, res) => {
    try {
        const document = await Users.findOne({ _id: req.params._id });
        if (!document) {
            return res.status(404).send("Invalid Link or Link expired register again...");
        }
        else {
            document.Status = 1;
            await document.save();
            return res.status(200).redirect('/home');
        }
    }
    catch {
        return res.status(404).send("Oops Somthing went wrong...");
    }
})

router.get('/forget-password/verify/:_id', async (req, res) => {
    try {
        const document = await Users.findOne({ _id: req.params._id });
        if (!document) {
            return res.status(404).send("Invalid Link or Link expired register again...");
        }
        else {
            document.Status = 1;
            await document.save();
            return res.render('forgetpass', { msg: 'Email is Verified...', verified: true, email: document.EmailID });
        }
    }
    catch (err) {
        return res.status(404).send('page not found');
    }
});


// login router... storing cookies here
router.post('/login', async (req, res) => {
    try {
        const document = await Users.findOne({ EmailID: req.body.emailid });
        if (!document) {
            return res.status(200).render('register', { msg: `No user exist with ${req.body.emailid}`, reg: true });
        }
        else {
            if (document.Status === 0) {
                return res.status(200).render('register', { msg: `Please verify your email ID before Login`, reg: false });
            }
            const iscompare = await bcrypt.compare(req.body.password, document.Password);
            if (!iscompare) {
                return res.status(200).render('register', { msg: `InCorrect Password`, reg: false });
            }
            const token = await document.generateAuthToken();
            res.cookie("sharekaro", token, {
                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 3)),
                httpOnly: true
            })
            return res.status(200).render('home');
        }
    }
    catch {
        res.status(400).render('register', { msg: 'oops facing problem in register', reg: true });
    }
});


// logout router clearing cookies here....
router.get('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((ele) => {
            return ele.token != req.token;
        })
        res.clearCookie('sharekaro');
        console.log("log out succesful");
        await req.user.save();
        res.render('register', { msg: 'Sucessfuly LogOut..', reg: false });
    }
    catch (err) {
        res.status(400).send('unable to logout');
    }
});

router.get('/forget-password', (req, res) => {
    res.status(200).render('forgetpass', { msg: undefined, verified: false });
});

router.post('/forget-password', async (req, res) => {
    try {
        const EmailID = req.body.emailID;
        const userData = await Users.findOne({ EmailID });
        if (!userData) {
            res.render('forgetpass', { msg: 'No User Exist with this email Id.', verified: false });
            return;
        }
        if (!req.body.password) {
            userData.Status = 0;
            await userData.save();
            console.log(userData);
            const userid = await userData._id;
            // console.log("yep i got the id:",userid.toString());
            const _idd = await userid.toString();

            // now sending email....
            const sendEmail = require('../services/emailService');
            sendEmail({
                from: 'deepaknitd142024@gmail.com',
                to: EmailID,
                subject: 'ShareKaro File Sharing',
                text: "jai shree ram",
                html: require('../services/emailverifytemplate')({
                    emailFrom: EmailID,
                    downloadLink: `${process.env.APP_BASE_URL}/forget-password/verify/${_idd}`,
                    expires: '24 hours'
                })
            });
            res.render('forgetpass', { msg: `Verification link is sent to ${EmailID}`, verified: false });
        }
        else
        {
            if(req.body.password !== req.body.cpassword)
            {
                res.render('forgetpass',{msg: 'password do not match!',verified: true, email: EmailID});
            }
            else
            {
                userData.Status = 1;
                userData.Password = req.body.password;
                await userData.save();
                res.render('register',{msg: 'Password is succesfully changed. Login to use Service',reg: false});
            }
        }
    }
    catch (err) {
        res.send('unable to set password');
    }
});

module.exports = router;
