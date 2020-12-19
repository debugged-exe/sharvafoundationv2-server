const express = require('express');
const morgan = require('morgan');
var cors = require('cors')
// express app
const app = express();
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
      res.statusCode=200
      res.send("Successfully inserted")  
    }
  })
})

// 404 page
app.use((req, res) => {
  res.status(404)
});