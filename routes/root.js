var express = require('express');
var app = express();
var router = express.Router();

var index = require('./index');
var accounts = require('./accounts/accounts');
var customer = require('./customer/customer');


router.use('/', index);
router.use('/accounts', accounts);
router.use('/customer', customer);



module.exports = router;