const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const envPath = path.join(__dirname,'src/.env');
dotenv.config({path: envPath});
// console.log(envPath);

const connectDB = require('./db/connection');
connectDB();

// using pulic files.
app.use(express.static(path.join(__dirname,'/public')));

// Template Engine.
app.use(cookieParser());
const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:true}))


app.set('view engine', 'ejs');

// Routes.
app.use(require('./db/Routes/files'));
app.use(require('./db/Routes/show'));
app.use(require('./db/Routes/sign'));


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Listing on port ",PORT);
})