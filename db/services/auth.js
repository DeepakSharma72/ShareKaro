const jwt = require('jsonwebtoken');
const Users = require('../models/user');

const auth = async (req,res,next) => {
    try{
        const token = req.cookies.sharekaro;
        const verifyuser = jwt.verify(token,process.env.SECRET_KEY);
        const user = await Users.findOne({_id: verifyuser._id});
        req.token = token;
        req.user = user;
        console.log('user is verified');
        next();
    }
    catch(err){
        res.render('register',{msg: 'Please Login to use ShareKaro Service', reg: false});
    }
}

module.exports = auth;