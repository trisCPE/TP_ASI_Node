'use strict'

// Includes functions to generate UUID, manage filenames and file path etc...
const utils = require("../utils/utils.js")
// To manage files
const fs = require("fs")
var CONFIG = require("../../config.json");
const contentDirectory = CONFIG.contentDirectory;

class ContentModel {
    constructor({ type, id, title, src, fileName }) {
        // Public
        this.type = type;
        this.id = id;
        this.title = title;
        this.src = src;
        this.fileName = fileName;

        // Private
        let data;

        // Getter / Setter
        this.setData = (dataToSet) => {data = dataToSet};
        this.getData = () => {return data};
    }

    // Creates :
    // - A file called content.fileName in the content folder indicated in CONFIG.json
    // - A file called [content.id].meta.json in the content folder
    static create(content, callback) {
        if (!(content instanceof ContentModel) || !content.id) {
            return callback(new Error('Type invalide !'));
        }

        const data = content.getData();
        const filePathData = utils.getDataFilePath(content.fileName);

        fs.writeFile(filePathData, data, function(err){
            if (err) return callback(err);

            const metaData = JSON.stringify(content);
            const filePathMetadata = utils.getDataFilePath(content.id + ".meta.json");
            fs.writeFile(filePathMetadata, metaData, function(err){
                if (err) return callback(err);

                callback(null, content);
            });
            
        });
    }

    // Returns a ContentModel object containing the info contained in the file [id].meta.json
    // from the content folder
    static read(id, callback) {
        if(id !== null){
        utils.readFileIfExists(utils.getDataFilePath(id + ".meta.json"),function(err, data) {
            if (err)  {
                return callback(err);
            }
            callback(null, new ContentModel(JSON.parse(data.toString())));
        });
    }
}

    // Tries to read the file [content.id].meta.json and updates it with the create function if successful
    static update(content, callback) {
        
        ContentModel.read(content.id,(err) => {
            if(err) {
                return callback(err);
            }

            const metadata = JSON.stringify(content);
            const filePathMetadata = utils.getDataFilePath(content.id + ".meta.json");

            ContentModel.create(content,callback);


        });
    }

    // Deletes both the files corresponding to id containing the data and the metadata 
    static delete(id, callback) {

        ContentModel.read(id,(err,content) => {
            if(err) return callback(err);

            fs.unlink(utils.getDataFilePath(content.fileName),(err) => {
                if (err) return callback(err);
    
                console.log(`${content.fileName} was deleted`);

                const metaFilePath = utils.getDataFilePath(id + ".meta.json");
                fs.unlink(metaFilePath, (err) => {
                    if (err) return callback(err);
        
                    console.log(`${metaFilePath} was deleted`);
                    callback(err);
                    
                  });
              });
        });


    }
}

module.exports = ContentModel;
