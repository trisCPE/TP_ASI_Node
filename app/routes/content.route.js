// helps write clean code
'use strict'

const express = require("express");
const multer = require("multer");
const router = express.Router();
var contentController = require('../controllers/content.controller');

//multer allows the upload of files
var multerMiddleware = multer({ "dest": "/tmp/" });

router.post("/contents", multerMiddleware.single("file"), contentController.create);
/**
 * Multer ajoute à l'objet `request` la propriété `file` qui contient plusieurs informations comme:
 *  - request.file.path : le chemin d'acces du fichier sur le serveur
 *  - request.file.originalname : le nom original du fichier
 *  - request.file.mimetype : le type mime
 *  - ...
 */

//router.route('/contents')
  // Declare the result of a get request to the route /
  //.post(function(req,res){
  //  res.end('Default Route / ');
 // });

router.get('/contents/:id',contentController.read)
    

router.get('/contents',contentController.list)
    
router.param("contentId", function(req, res, next, id) {
  req.contentId = id;
  next();
});

// Export cause implemented in another file
module.exports = router;
