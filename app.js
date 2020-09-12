require('dotenv').config();       // requiring environment var
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const encrypt = require("mongoose-encryption"); not using
const md5 = require("md5");

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

 // const secret = process.env.API_KEY;//creating secrete const //// Now this is not using
// userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']}); // adding encrypt plugin before userSchema model to encrypt only password

const User = new mongoose.model("User", userSchema);


app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

////new user document database with mongoose when user registers
app.post("/register", function(req,res){
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err){
    if(err){
      res.send(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req,res){
  const username = req.body.username;   //// user entering into login form
  const password = md5(req.body.password);

///verifying user login credentials with our DB
  User.findOne({email: username}, function(err,foundUser){
    if(err){
      console.log(err);
    }
    else if(!foundUser){
      res.sendFile(__dirname+ "/failure.html");
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
        else{
          res.sendFile(__dirname+ "/failure.html");
        }
      }
    }
  });
});
app.post("/failure", function(req,res){ //// from failure page redirecting to login page
  res.redirect("/login");
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
