const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    EmailID: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    Status: {
        type: Number,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(err){
        console.log("token not generated due to:",err);
        return null;
    }
}

userSchema.pre("save",async function(next){
    if(this.isModified("Password"))
    {
        this.Password = await bcrypt.hash(this.Password,10);
        console.log("password is hashed: ",this.Password);
    }
    next();
});

const userCollection = new mongoose.model("User",userSchema);

module.exports = userCollection;

