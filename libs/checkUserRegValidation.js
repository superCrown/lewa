var async    = require('async');
var mongoose = require('mongoose');

var User = require('../models/UserModel');

function checkUserRegValidation(req, res, next) {
    var isValid = true;
  
    async.waterfall(
      [function(callback) {
        User.findOne({email: req.body.email, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
          function(err,user){
            if(user){
              isValid = false;
              req.flash("emailError","- 이미 존재하는 이메일 입니다...");
            }
            callback(null, isValid);
          }
        );
      }, function(isValid, callback) {
        User.findOne({nickname: req.body.nickname, _id: {$ne: mongoose.Types.ObjectId(req.params.id)}},
          function(err,user){
            if(user){
              isValid = false;
              req.flash("nicknameError","- 이미 존재하는 닉네임입니다...");
            }
            callback(null, isValid);
          }
        );
      }], function(err, isValid) {
        if(err) return res.json({success:"false", message:err});
        if(isValid){
          return next();
        } else {
          req.flash("formData",req.body.user);
          res.redirect("back");
        }
      }
    );
  }

 module.exports = checkUserRegValidation;