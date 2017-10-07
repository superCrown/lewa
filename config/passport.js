var passport      = require("passport");
var LocalStrategy = require("passport-local");
var User          = require("../models/UserModel");

// serialize & deserialize User
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findOne({_id:id}, function(err, user) {
    done(err, user);
  });
});

// local strategy
passport.use("local-login",
  new LocalStrategy({
      usernameField : "email",
      passwordField : "password",
      passReqToCallback : true
    },
    function(req, email, password, done) {
      User.findOne({email:email})
      .select({password:1})
      .exec(function(err, user) {
        if (err) return done(err);

        if (user && user.authenticate(password)){
          return done(null, user);
        } else {
          req.flash("email", email);
          req.flash("errors", {login:"Incorrect email or password"});
          return done(null, false);
        }
      });
    }
  )
);

module.exports = passport;
