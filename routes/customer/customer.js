var express = require('express');

var Post = require('../../models/post');
var router = express.Router();

/* GET home page. */
router.get('/',  function(req, res, next) {
  Post.find({})
  .sort("-createdAt")
  .exec(function(err, posts){
    if(err) return res.json(err);
    res.render('customer/customer', { user:req.user, posts : posts });
  });
});

//create
router.post("/", function(req, res, next){
  Post.create(req.body, function(err, post){
    if(err) return res.json(err);
    res.redirect("/customer")
  });
});

//New
router.get("/new", function(req, res, next){
  res.render("customer/new", {user:req.user});
});

router.get("/:id", function(req, res, next){
  Post.findOne({ 'id' : req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render("customer/show", {user:req.user , post:post});
  });
});

router.get("/edit/:id", function(req, res){
  Post.findOne({ 'id' : req.params.id}, function(err, post){
    if(err) return res.json(err);
    res.render("customer/edit", {user:req.user, post:post});
  });
});

// update
router.post("/edit/:id", function(req, res){
  req.body.updatedAt = Date.now(); // 2
  Post.findOneAndUpdate({ 'id' :req.params.id}, req.body, function(err, post){
   if(err) return res.json(err);
   res.redirect("/customer/"+req.params.id);
  });
 });
 
 // destroy
 router.get("/delete/:id", function(req, res){
  Post.remove({ 'id' : req.params.id}, function(err){
   if(err) return res.json(err);
   res.redirect("/customer");
  });
 });
 

module.exports = router;
