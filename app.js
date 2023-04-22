//jshint esversion:6
require("dotenv").config();
var express = require("express");
var ejs = require("ejs");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// var md5 =  require("md5");
const bcrypt = require("bcrypt");
var saltRounds = 10;

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

const url = "mongodb://127.0.0.1/userDB";
mongoose.connect(url);

const userSchema  = new mongoose.Schema({
    email:String,
    password:String
});
console.log(process.env.SECRET);

const User  = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.post("/login",(req,res)=>{
    const username = req.body.username;
    User.findOne({email:username}).then((foundUser)=>{
        if(foundUser){
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
                if(result){
                    res.render("secrets");
                }
            })
        }
    })
})
app.get("/register",(req,res)=>{
    res.render("register")
});
app.post("/register",(req,res)=>{

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        var newUser = new User({
            email :req.body.username,
            password : hash
        })
        newUser.save().then(()=>{
            console.log("New user added.")
            res.render("secrets");
        });
    });

    
})


app.listen(process.env.PORT || 3000,()=>{
    console.log("server is running at 3000");
})