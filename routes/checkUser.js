/**
 * Check if the user is valid
 * This can mean :
 *      We check if a user *can* exist
 *      We check if a user of the following credintials *exists*
 *      We 
 */

var express = require('express');
var router = express.Router();
var tokens = require('../helpers/tokens');

var database = require("../conf/database.js");
const Users = require('../models/user');


router.post('/login', function(req,res, next){
    // console.log("Someone tried logging in with:");
    // console.log(req.body);
    // console.log(req.body);
    // toUse = req.body; //if using forms
    // if (toUse == {}) toUse = req.params
    Users.findOne({
        usrn:req.body.usrn,
        pwd:req.body.pwd
    }, function(err,user) {
        if (err) {
            res.status(404).send({valid:"err"});
        } else {
            if (user == null) {
                res.send({valid:"incorrrect"});
            } else{
                next();
            }
        }

    });
});

router.post('/login', function(req,res,next) {
    //do something to take them to the next page
    var nToken = tokens.createToken({
        usrn:req.body.usrn,
        exp:Date.now()+86400000, //a day
        iss:"BetterChatroom"
    })
    //res.setHeader("Set-Cookie","JWT="+nToken+";Secure;HttpOnly");
    res.cookie("JWT",nToken, {httpOnly:true, secure: false});
    res.send({valid:"true"});
    // res.render('index',{title:"you're logged in"});
})


router.post('/register/:purpose', function(req, res, next) {
    //test if the username is already taken
    console.log("checking username availability");
    Users.findOne({usrn:req.body.usrn}, function(err, user) {
        if (user == null) next();
        else res.send({valid:"unavailable"});
    })
})

router.post('/register/createUser', function(req, res, next) {
    //username is not taken
    //assume all required parts are here
    console.log("username available");
    Users.create({
        usrn:req.body.usrn,
        pwd:req.body.pwd,
        fName:req.body.fName,
        lName:req.body.lName,
        join_date:new Date(),
        age:req.body.age,
        recent:[]
    }, function(err) {
        if (err) {
            res.status(404).send({valid:"err"});
        } else {
            res.send({valid:"true"});
        }
    })
});

router.post('/register/:purpose', function(req,res,next) {
    res.send({valid:"available"});
});
module.exports = router;


