const express = require('express');
const morgan = require('morgan');
var cors = require('cors')
// express app
const app = express();
var nodemailer = require('nodemailer');
// listen for requests
app.listen(3000);

// register view engine
app.set('view engine', 'ejs');
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var contactEntry = new Schema({
  name: String,
  email:String,
  message:String,
  date: String,
  time:String
}, {
  collection: 'ContactUs'
});

var joinEntry = new Schema({
    name:String,
    dob:String,
    email:String,
    phone:String,
    padd:String,
    pcity:String,
    pstate:String,
    cadd:String,
    ccity:String,
    cstate:String,
    bgrp:String,
    category:String,
    message:String,
}, {
  collection: 'JoinUs'
});

mongoose.connect("mongodb://localhost:27017/sharva-db",{useNewUrlParser: true, useUnifiedTopology: true});

// middleware & static files
app.use(express.static('public'));
app.use(cors())
app.use((req, res, next) => {
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use((req, res, next) => {
  console.log('in the next middleware');
  next();
});

app.use(morgan('dev'));

app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(express.json());
var Model = mongoose.model('Model', contactEntry);
var joinModel = mongoose.model('Join', joinEntry);
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'contact.sharvafoundation@gmail.com',
    pass: 'tanmay@123'
  }
});

app.post('/insert',(req,res,next)=>{
  
  new Model({
    name:req.body.name,
    email:req.body.email,
    message:req.body.message,
    date: new Date(Date.now()).toLocaleString().split(',')[0],
    time:new Date().toLocaleTimeString()
  })
  .save((err,doc)=>{
    if(err){
      res.json(err)
    }
    else{
      var mailOptions = {
        from: 'contact.sharvafoundation@gmail.com',
        to: 'tanmayjagtap27@gmail.com',
        subject: 'New Contact Entry',
        text: 'Name: '+req.body.name+'\nEmail: '+req.body.email+'\nMessage: '+req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.statusCode=200
      res.send("Contact us successfully inserted")  
    }
  })
})


app.post('/joinus',(req,res,next)=>{
  
  new joinModel({
    name:req.body.name,
    dob:req.body.dob,
    email:req.body.email,
    phone:req.body.phone,
    padd:req.body.padd,
    pcity:req.body.pcity,
    pstate:req.body.pstate,
    cadd:req.body.cadd,
    ccity:req.body.ccity,
    cstate:req.body.cstate,
    bgrp:req.body.bgrp,
    category:req.body.category,
    message:req.body.message,
    date: new Date(Date.now()).toLocaleString().split(',')[0],
    time:new Date().toLocaleTimeString()
  })
  .save((err,doc)=>{
    if(err){
      res.json(err)
    }
    else{
      var mailOptions = {
        from: 'contact.sharvafoundation@gmail.com',
        to: 'tanmayjagtap27@gmail.com',
        subject: 'New Join Us Entry',
        text: 'Name: '+req.body.name+'\nEmail: '+req.body.email+'\nPhone: '+req.body.phone+'\nMessage: '+req.body.message
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });

      res.statusCode=200
      res.send("Join us successfully inserted")  
    }
  })
})


// 404 page
app.use((req, res) => {
  res.status(404)
});