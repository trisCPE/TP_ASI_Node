// helps write clean code
'use strict'

var express = require("express");
var router = express.Router();


router.route('/')
  // Declare the result of a get request to the route /
  .get(function(req,res){
    res.end('Default Route / ');
  });

// Export cause implemented in another file
module.exports = router;
