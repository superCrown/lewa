var express = require('express');
var app = express();
var router = express.Router();

var index = require('./index');
var posts = require('./posts');
var users = require('./users');



router.use('/', index);
router.use('/posts', posts);
router.use('/users', users);



module.exports = router;