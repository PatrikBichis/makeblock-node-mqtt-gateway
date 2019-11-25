const request = require('request');
const express = require('express')
const app = express()
const MegaPi = require("./src/megapi").MegaPi;
const port = 3030

var bot = undefined;
var servo1 = 90;
var servo2 = 90;

var mqtt = require('mqtt')
var client  = undefined;

// /* Route for static files */
// app.use(express.static('public'));

// /* Proxy route for web camera */
// app.get('/stream1',function(req,res){
//     var url="http://192.168.1.126/mjpeg.cgi"
//     var pipe=request(url).pipe(res);
//     pipe.on('error', function(){
//         console.log('error handling is needed because pipe will break once pipe.end() is called')
//     });
//     //client quit normally
//     req.on('end', function(){
//         pipe.end();
//     });
//     //client quit unexpectedly
//     req.on('close', function(){
//         pipe.end();
//     });
// });

var http = require("http").Server(app);
var io = require('socket.io')(http);

// // whenever a user connects on port 8080 via
// // a websocket, log that a user has connected
// io.on("connection", (socket) => {
//     console.log("a user connected");
//     // whenever we receive a 'message' we log it out
//     socket.on("message", function(message) {
//       //console.log(message);
//     });

//     socket.on("direction", (dir, value) => {
//         console.log(dir + ":" + value);
//         if(bot){
//             if(dir == "center"){
//                 servo1 = 90;
//                 servo2 = 90;
//             }else if(dir == "forward"){
//                 servo1 -= value;
//             }else if(dir == "backward"){
//                 servo1 += value;
//             }else if(dir == "left"){
//                 servo2 += value;
//             }else if(dir == "right"){
//                 servo2 -= value;
//             }
//             updateServos();
//         }
//     });
//   });

const server = http.listen(port, () => {
    console.log(`App listening to ${port}....`)
    console.log('Press Ctrl+C to quit.')

    client = mqtt.connect('mqtt://192.168.1.212:1883');
 
    client.on('connect', function () {
        client.subscribe('presence', function (err) {
            if (!err) {
                client.publish('presence', 'Hello mqtt')
            }
        })

        client.publish('makeblock/board/status/conencted', 'false');

        try {
            bot = new MegaPi("/dev/ttyUSB0", ()=>{
                console.log("Connected to bot")
                setTimeout(()=>{
                    updateRGBLed();
                    updateServos(100,20);
                    client.publish('makeblock/board/status/conencted', 'true');
                },3000);
            });

        }catch(err){
            client.publish('makeblock/board/status/conencted', 'false');
        }
    })

    client.on('disconnect', function(package){
        console.log('MQTT disconnected');
    })

    client.on('offline', function(package){
        console.log('MQTT offline');
    })
    
    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(message.toString())

        if(topic == 'makeblock/board/1/command/connect'){
            client.publish('makeblock/board/status/conencted', 'false');
            bot = new MegaPi("/dev/ttyUSB0", ()=>{
                console.log("Connected to makeblock")
                client.publish('makeblock/board/status/conencted', 'true');
            });
        }
        if(topic == 'makeblock/board/1/command/connect'){
            //port,slot,index,r,g,b
            var port = 4;
            var slot = 1;
            var index = 0;
            var r = 255;
            var g = 0;
            var b = 0;
            bot.rgbledDisplay(port,slot,index,r,g,b)
            bot.rgbledShow(port,slot)
        }
        //client.end()
    })

    
    // servo1 = 90;
    // servo2 = 90;
    // //updateServos();´

    // bot = new MegaPi("/dev/ttyUSB0", ()=>{
    //     console.log("Connected to makeblock")
    //     updateServos(0, 0);
    //     updateServos(90, 90);
    // });
    
});


function updateRGBLed(){
    var port = 4;
    var slot = 2;
    var index = 0;
    var r = 255;
    var g = 0;
    var b = 0;
    bot.rgbledDisplay(port,slot,index,r,g,b)
    bot.rgbledShow(port,slot)

    bot.sevenSegmentDisplay(3, 0.1);
}

function updateServos(servo1, servo2){
    bot.servoRun(6,1,servo1);
    bot.servoRun(6,2,servo2);
}