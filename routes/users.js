var express  = require("express");
var router   = express.Router();
var User     = require("../models/UserModel");
var util     = require("../util");

// Index
router.get("/", util.isLoggedin, function(req, res){
  User.find({})
  .sort({email:1})
  .exec(function(err, users){
    if(err) return res.json(err);
    res.render("users/index", {users:users});
  });
});

// New
router.get("/new", function(req, res){
  var user = req.flash("user")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("users/new", { user:user, errors:errors });
});

// create
router.post("/", function(req, res){
  User.create(req.body, function(err, user){
    if(err){
      req.flash("user", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/users/new");
    }
    res.redirect("/users");
  });
});

// show
router.get("/:id", util.isLoggedin, function(req, res){
  User.findOne({'id' : req.params.id}, function(err, user){
    if(err) return res.json(err);
    res.render("users/show", {user:user});
  });
});

// edit
router.get("/:id/edit", util.isLoggedin, checkPermission, function(req, res){
  var user = req.flash("user")[0];
  var errors = req.flash("errors")[0] || {};
  if(!user){
    User.findOne({'id' : req.params.id}, function(err, user){
      if(err) return res.json(err);
      res.render("users/edit", { 'id' : req.params.id, user:user, errors:errors });
    });
  } else {
    res.render("users/edit", { 'id' : req.params.id, user:user, errors:errors });
  }
});

// update
router.put("/:id", util.isLoggedin, checkPermission, function(req, res, next){
  User.findOne({'id' : req.params.id})
  .select({password:1})
  .exec(function(err, user){
    if(err) return res.json(err);

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword : user.password;
    for(var p in req.body){
      user[p] = req.body[p];
    }

    // save updated user
    user.save(function(err, user){
      if(err){
        req.flash("user", req.body);
        req.flash("errors", util.parseError(err));
        return res.redirect("/users/"+req.params.id+"/edit");
      }
      res.redirect("/users/"+user.id);
    });
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  User.findOne({'id' : req.params.id}, function(err, user){
    if(err) return res.json(err);
    if(user.id != req.user.id) return util.noPermission(req, res);

    next();
  });
}
