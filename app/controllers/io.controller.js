module.exports = IOController;

var contentModel = require("../models/content.model.js");
var io;

var map = {},
    numOfUsers = 0;

function IOController() {}

IOController.listen = function(server) {
        io = require("socket.io")(server);

        io.on('connection', function(socket) {

            socket.on('data_com', function() {
                map[socket.id] = socket;
            });

        
            //routine from options
            socket.on('slidEvent', function(slidEvent) {
            
                switch (slidEvent.CMD) {

                    case 'START':
                        io.emit('currentSlidEvent',slidEvent);
                        break;

                    case 'NEXT':
                     
                        break;

                    case 'PREV':
                    
                        break;
                    case 'END':
                

                    break;
                    default:
                        break;
                }
            });
        });

};
