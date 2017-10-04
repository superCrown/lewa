var express = require('express');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var UserModel = require('../../models/UserModel');
var passwordHash = require('../../libs/passwordHash');

var router = express.Router();

passport.serializeUser(function (user, done) {
    console.log('serializeUser');
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    var result = user;
    result.password = "";
    console.log('deserializeUser');
    done(null, result);
});

passport.use(new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function (req, username, password, done) {
        UserModel.findOne({ username : username , password : passwordHash(password) }, function (err,user) {
            if (!user){
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user );
            }
        });
    }
));



/* GET join page. */

router.get('/join', function(req, res, next) {
    res.render('accounts/join' , {user:req.user});
  });


  router.post('/join', function(req, res){
    var User = new UserModel({
        username : req.body.username,
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
    res.render('accounts/login', { flashMessage : req.flash().error, user:req.user  });
});

router.post('/login' , 
passport.authenticate('local', { 
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
router.get("/:id", function(req, res){
    UserModel.findOne({'id' :req.params.id}, function(err, user){
     if(err) return res.json(err);
     res.render("accounts/show", {user:req.user});
    });
   });

// edit
router.get("/:id/edit", function(req, res){
    UserModel.findOne({'id' :req.params.id}, function(err, user){
     if(err) return res.json(err);
     res.render("accounts/edit", {user:req.user});
    });
   });
   
   // update // 2
   router.post("/:id",function(req, res, next){
    UserModel.findOne({'id' :req.params.id}) // 2-1
    .select("password") // 2-2
    .exec(function(err, user){
     if(err) return res.json(err);
     var user = req.user;
     // update user object
     user.originalPassword = user.password;
     user.password = req.body.newPassword? req.body.newPassword : user.password; // 2-3
     for(var p in req.body){ // 2-4
      user[p] = req.body[p];
     }
     // save updated user
     UserModel.save(function(err, user){
      if(err) return res.json(err);
      res.send('<script>alert("변경 성공");location.href="/accounts/"+req.params.nickname";</script>');
    //   res.redirect("/users/"+req.params.nickname);
     });
    });
   });
   


module.exports = router;
