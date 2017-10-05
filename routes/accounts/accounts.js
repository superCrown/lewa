var express = require('express');
var mongoose = require('mongoose');
var UserModel = require('../../models/UserModel');
var isLoggedIn = require('../../libs/isLoggedIn')


var passport = require('../../config/passport.js');
var checkUserRegValidation = require('../../libs/checkUserRegValidation');

var router = express.Router();

/* GET join page. */

router.get('/join', function(req, res, next) {
    res.render('accounts/join' , {
        emailError: req.flash('emailError')[0],
        nicknameError: req.flash('nicknameError')[0], 
        user:req.user
        });
  });

  router.post('/join', checkUserRegValidation, function(req, res){
    var User = new UserModel({
        email : req.body.email,
        password : passwordHash(req.body.password),
        nickname : req.body.nickname,
        displayname : req.body.displayname
    });
    User.save(function(err){
        res.send('<script>alert("회원가입 성공");location.href="/accounts/login";</script>');
    })
});

/* ====GET join page. =====*/


/* GET login page. */

router.get('/login', function(req, res){
    res.render('accounts/login', { 
        flashMessage : req.flash().error, 
        user:req.user  
    });
});

router.post('/login' , 
passport.authenticate('local-login', { 
    failureRedirect: '/accounts/login', 
    failureFlash: true 
}), 
function(req, res){
    res.send('<script>alert("로그인 성공"); location.href="/";</script>');
}
);

router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/accounts/login');
});

/* ====GET login page. =====*/

 
// // show
router.get("/:id", isLoggedIn, function(req, res){
    UserModel.findOne({'id' :req.params.id}, function(err, user){
     if(err) return res.json(err);
     res.render("accounts/show", {user:req.user});
    });
   });

   // edit
router.get('/:id/edit', isLoggedIn,  function(req,res){
if(req.user.id != req.params.id) return res.json({success:false, message:"허용되지 않은 접근입니다."});
UserModel.findOne({ 'id' :req.params.id}, function (err,user) {
    if(err) return res.json({success:false, message:err});
    res.render("accounts/edit", {
                            user: user,
                            formData: req.flash('formData')[0],
                            emailError: req.flash('emailError')[0],
                            nicknameError: req.flash('nicknameError')[0],
                            passwordError: req.flash('passwordError')[0]
                            }
         );
    });
});
  
  router.put('/:id', isLoggedIn, checkUserRegValidation, function(req,res){
    if(req.user.id != req.params.id) return res.json({success:false, message:"허용되지 않은 접근입니다."});
    UserModel.findOne({'id' : req.params.id}, req.body.user, function (err,user) {
      if(err) return res.json({success:"false", message:err});
      if(user.authenticate(req.body.user.password)){
        if(req.body.user.newPassword){
          user.password = req.body.user.newPassword;
          user.save();
        } else {
          delete req.body.user.password;
        }
        User.findByIdAndUpdate(req.params.id, req.body.user, function (err,user) {
          if(err) return res.json({success:"false", message:err});
          res.redirect('/accounts/'+req.params.id);
        });
      } else {
        req.flash("formData", req.body.user);
        req.flash("passwordError", "- Invalid password");
        res.redirect('/accounts/'+req.params.id+"/edit");
      }
    });
  }); //update

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }
    res.redirect('/');
  }


// // edit
// router.get("/:id/edit", isLoggedIn, function(req, res){
//     UserModel.findOne({'id' :req.params.id}, function(err, user){
//      if(err) return res.json(err);
//      res.render("accounts/edit", {user:req.user});
//     });
//    });
   
//    // update // 2
//    router.post("/:id",function(req, res, next){
//     UserModel.findOne({'id' :req.params.id}) // 2-1
//     .select("password") // 2-2
//     .exec(function(err, user){
//      if(err) return res.json(err);
//      var user = req.user;
//      // update user object
//      user.originalPassword = user.password;
//      user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
//      for(var p in req.body){ // 2-4
//       user[p] = req.body[p];
//      }
//      // save updated user
//      UserModel.save(function(err, user){
//       if(err) return res.json(err);
//       res.send('<script>alert("변경 성공");location.href="/accounts/"+req.params.nickname";</script>');
//     //   res.redirect("/users/"+req.params.nickname);
//      });
//     });
//    });
   



module.exports = router;
