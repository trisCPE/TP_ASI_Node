'use strict'

// Includes functions to generate UUID, manage filenames and file path etc...
const utils = require("../utils/utils.js")
// To manage files
const fs = require("fs")

const express = require("express");
const router = express.Router(); // Get the config from the config.json file
const CONFIG = JSON.parse(process.env.CONFIG);


const presentationDirectory = CONFIG.presentationDirectory;

// console.log(CONFIG.presentationDirectory);

router.route('/savePres')
  .post(function(req, res) {
    // Get the message from the post query in query
    const sentData = req.body;

    if(sentData !== undefined && sentData.id !== undefined) {
      const filename = sentData.id + ".pres.json";
      // Concatenate the filname with the the content directory path
      const filepath = utils.getDataFilePath(filename);
  
      console.log(filepath);
      console.log(sentData);
  
      // Writes the data received in the file
      fs.writeFile(filepath, JSON.stringify(sentData), function(err){
        if (err) throw err;
      })
  
      res.send(`We wrote ${sentData} in the file called ${filepath}`);
      res.end();
    }
    else {
      res.send("We didn't receive any id!");
      res.end();
    }
    

  });



router.route('/loadPres')
  .get(function(req,res){
    const jsonfinal = {};

    // Reads the content of the folder presentation
    fs.readdir(presentationDirectory, function(err,files) {
      if (err) throw err;

      // Gets the number of files contained in presentation
      const numberFiles = files.length;
      
      // For each file contained in presentation
      files.forEach(function(file){
        console.log("file:" + file);

        // We read the file by adding again the path cause file only contains the filename
        utils.readFileIfExists(presentationDirectory+"/"+file,function(err, data) {
          if (err) throw err;

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
  });

module.exports = router;
