var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var UserModel = require('../models/UserModel');
var passwordHash = require('../libs/passwordHash');

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });


// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });


// // passport.deserializeUser(function (user, done) {
// //     var result = user;
// //     result.password = "";
// //     console.log('deserializeUser');
// //     done(null, result);
// // });

// passport.use('local-login',
//   new LocalStrategy({
//       usernameField : 'email',
//       passwordField : 'password',
//       passReqToCallback : true
//     },
//     function(req, email, password, done) {
//       User.findOne({ 'email' :  email }, function(err, user) {
//         if (err) return done(err);

//         if (!user){
//             req.flash("email", req.body.email);
//             return done(null, false, req.flash('loginError', 'No user found.'));
//         }
//         if (!user.authenticate(password)){
//             req.flash("email", req.body.email);
//             return done(null, false, req.flash('loginError', 'Password does not Match.'));
//         }
//         return done(null, user);
//       });
//     }
//   )
// );

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

passport.use('local-login', 
new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    }, 
    function (req, email, password, done) {
        UserModel.findOne({ email : email , password : passwordHash(password) }, function (err,user) {
            if (!user){
                return done(null, false, { message: '아이디 또는 비밀번호 오류 입니다.' });
            }else{
                return done(null, user );
            }
        });
    }
));

module.exports = passport;
