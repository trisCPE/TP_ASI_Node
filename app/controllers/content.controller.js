/* Controller which aims to link model and router */ 
'use strict';

var CONFIG = require("../../config.json");
var ContentModel = require("../models/content.model");
const fs = require('fs');
var utils = require("../utils/utils.js");
const contentDirectory = CONFIG.contentDirectory;

class ContentController {

    // Empty constructor
    constructor() {
      this.contentModel = new ContentModel();
    }
  

static list(req,res){
    const jsonfinal = {};

    // Reads the content of the folder content
    fs.readdir(contentDirectory, function(err,files) {
      if (err) throw err;

      // Gets the number of files contained in presentation
      const numberFiles = files.length;
      
      // For each file contained in presentation
      files.forEach(function(file){
        console.log("file:" + file);

        // We read the file by adding again the path cause file only contains the filename
        utils.readFileIfExists(contentDirectory+"/"+file,function(err, data) {
          if (err) {
        let jsonMessage = {"msg" : "An error has occured when list the files"};
          res.write(JSON.stringify(jsonMessage));
          res.end();}

          // We parse the content of the file to get the id it contains
          const temp = JSON.parse(data);
          console.log(`The file ${file} contains the id : ${temp.id}`);
          
          // Appends the file's object in the jsonfinal object we gonna return
          jsonfinal[temp.id] = temp;

          // If it was the last file of the folder we just processed,
          // We send back the jsonfinal here cause this is an asynchrone task
          if(file === files[numberFiles-1]) {

            // To be sure to go through json parser
            res.json(jsonfinal);
            // Finish response
            res.end();
          }

        });
      });
    });
}


//Create a new contentModel

    static create(req, res) {
        const content = new ContentModel({
        id : utils.generateUUID(),
        type : req.body.type,
        title : req.body.title
    });
    console.dir(req.file);
    console.log(req.body)

    if(content.type !== "img"){
        content.src = src;

        ContentModel.create(content,(err,callback)=>{

            if(err){
                let jsonMessage = {"msg" : "An error has occured when create the ContentModel"};
                res.write(JSON.stringify(jsonMessage));
                res.end();
            }
            else{
                let jsonMessage = {"msg" : "File created", "fileName" : content.fileName};
                res.write(JSON.stringify(jsonMessage));
                res.end();
            
        }
    });
   }

   else {
      fs.readFile(req.file.path, function(err, data) {
      content.setData(data);
      content.fileName = utils.getNewFileName(content.id, req.file.originalname);
      ContentModel.create(content,(err,callback)=>{

        if(err){
        //let jsonMessage = {"msg" : "An error has occured when create the ContentModel"};
        console.error(err);
        res.status(500).end(err.message);
        }

        else{
        let jsonMessage = {"msg" : "File created", "fileName" : content.fileName};
        res.write(JSON.stringify(jsonMessage));
        res.end();
        }
}) 

})
   }
  }

static read(req,res){
    ContentModel.read(req.params.contentId,(err,ContentModel) => {

       if(err){
            let jsonMessage = {"msg" : "Error, file doesn't exist !!"};
            res.write(JSON.stringify(jsonMessage));
            res.end();
        }
        else{
              if(ContentModel.type === 'img'){
                  ContentModel = JSON.parse(ContentModel);
                  res.sendFile("../content2/" + ContentModel.fileName);
                res.end();
            }
              else if (req.query.json === 'true') { // MetaData
                  res.write(JSON.stringify(file));
                  console.log("noRedirection !")
                  res.end();
              }
              else if (ContentModel.src !== "../content2/".concat(ContentModel.id)) {
                  res.redirect(301, ContentModel.src);
                  console.log("Redirection !")
                  res.end();
                  }
        }

    });
}

}

module.exports = ContentController;