var express = require("express");
var router  = express.Router();
var passport= require("../config/passport");

// Home
router.get("/", function(req, res){
  res.render("home/welcome",
  {
    users : req.user,
  }
);
});

// Login
router.get("/login", function (req,res) {
  var email = req.flash("email")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
    users : req.user,
    email:email,
    errors:errors
  });
});

// Post Login
router.post("/login",
  function(req,res,next){
    var errors = {};
    var isValid = true;

    if(!req.body.email){
      isValid = false;
      errors.email = "이메일은 필수입니다.";
    }
    if(!req.body.password){
      isValid = false;
      errors.password = "패스워드는 필수입니다.";
    }

    if(isValid){
      next();
    } else {
      req.flash("errors",errors);
      res.redirect("/login");
    }
  },
  passport.authenticate("local-login", {
    successRedirect : "/",
    failureRedirect : "/login"
  }
));

// Logout
router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
