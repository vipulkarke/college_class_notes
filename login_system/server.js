const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const  {v4:uuidv4}= require('uuid'); 
const multer = require('multer');

var fs = require("fs");

const db = require('./db');

const router = require('./router');
const { fstat, fsync } = require('fs');

const app = express();

const port = process.env.PORT||3000;

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))

app.set("view engine","ejs")


//load static assets
app.use('/static',express.static(path.join(__dirname,'public')))
app.use('/assets',express.static(path.join(__dirname,'public/assets')))

app.use(session({
    secret:uuidv4(),
    resave: false,
    saveUninitialized: true 
}));

app.use('/route',router);


//home route
app.get('/',(req,res)=>{
    res.render('base',{title:"Login System"})
})
app.get('/base',(req,res)=>{
    res.render('base',{title:"Login System"})
})

//register
app.get('/register',(req,res)=>{
    res.render('register',{title:"Register System"})
})

app.listen(port,()=>{console.log("Listning to the server on hhtp://localhost:3000")}); 