const request = require('request');
const express = require('express')
const app = express()
const MegaPi = require("./src/megapi").MegaPi;
const device = require("./src/devices/device");
import { deviceType } from "./deviceTypes";
import { board } from "./src/boards/board";
import {device} from "./src/devices/device";
const port = 3030

var bot = undefined;
var servo1 = 90;
var servo2 = 90;
var axisX = 0;
var axisY = 0;
var oldaxisX = 0;
var oldaxisY = 0;
var oldSound = 0;
var oldLight = 0;

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

        bot = new board(1, "orion", "/dev/ttyUSB0");
        bot.devices.push(new device(bot,4,deviceType.RGB_LED));
        
        
        // client.publish('makeblock/orion/1/status/conencted', 'false');

        // try {
        //     bot = new MegaPi("/dev/ttyUSB0", ()=>{
        //         console.log("Connected to bot")
        //         setTimeout(()=>{
        //             updateRGBLed();
        //             updateServos(100,20);

        //             onStart();

        //             client.publish('makeblock/orion/1/status/conencted', 'true');
        //         },3000);
        //     });

        // }catch(err){
        //     client.publish('makeblock/orion/1/status/conencted', 'false');
        // }
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

        if(topic == 'makeblock/orion/1/command/connect'){
            client.publish('makeblock/orion/1/status/conencted', 'false');
            bot = new MegaPi("/dev/ttyUSB0", ()=>{
                console.log("Connected to makeblock")
                client.publish('makeblock/orion/1/status/conencted', 'true');
            });
        }
        // if(topic == 'makeblock/orion/1/command/connect'){
        //     //port,slot,index,r,g,b
        //     var port = 4;
        //     var slot = 1;
        //     var index = 0;
        //     var r = 255;
        //     var g = 0;
        //     var b = 0;
        //     bot.rgbledDisplay(port,slot,index,r,g,b)
        //     bot.rgbledShow(port,slot)
        // }
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

function loop(){
    bot.joystickRead(6,1,onReadX);
}

function onStart(){
    setInterval(loop,300);
}

function onReadX(x){
    axisX = x;
    bot.joystickRead(6,2,onReadY);
}
  
function onReadY(y){
    axisY = y;
    // if((oldaxisX != axisX && Math.abs(oldaxisX - axisX) > 2) || (oldaxisY != axisY && Math.abs(oldaxisY - axisY) > 2)){ 
    //     console.log("Jostick: X"+ axisX +", Y"+axisY);
        sendSensorData(1, "orion", 6, "Joystick", axisX, axisY);
        oldaxisX = axisX;
        oldaxisY = axisX;
    // }
    ReadSoundSensor();
    ReadLightSensor();
}

function ReadSoundSensor(){
    //console.log("Connecting to sound sensor...")
    var port = 7;
    bot.soundSensorRead(port, onRead);
    //console.log("Connected to sound sensor.")
}

function ReadLightSensor(){
    //console.log("Connecting to light sensor...")
    bot.lightSensorRead(8,function(value){
        // if(oldLight != value && Math.abs(oldLight - value) > 2){
            console.log(value);
            sendSensorData(1, "orion", 8, "Light", value, null);
            oldLight = value;
        // }
    });
    //console.log("Connected to light sensor.")
}

function onRead(value){
    // if(oldSound != value && Math.abs(oldSound - value) > 2){
        console.log("Sound sensor value: " + value.toString());
        sendSensorData(1, "orion", 7, "Sound", value, null);
        oldSound = value;
    // }
    //console.log(value);
}

function sendSensorData(id,board, port, type, valueA, valueB){
    var data = {
        id: id,
        board, board,
        port: port,
        type: type,
        unit: "%",
        mapping:{min:0, max:1023},
        valueA: valueA,
        valueB: valueB
    }
    
    if(type == "Sound"){
        data.unit = "db";
    };

    client.publish('makeblock/'+board+'/'+id+'/sensor', JSON.stringify(data));
}

function sendCommandData(id,board,port,type,valueA, valueB){
    var data = {
        id: id,
        board, board,
        port: port,
        type: type,
        unit: "°",
        mapping: null,
        payload: valueA
    }

    client.publish('makeblock/'+board+'/'+id+'/command/'+type.toLowerCase() +'', JSON.stringify(data));
}

function updateRGBLed(){
    var port = 4;
    var slot = 2;
    var index = 0;
    var r = 255;
    var g = 0;
    var b = 0;
    bot.rgbledDisplay(port,slot,index,r,g,b)
    // bot.rgbledDisplay(port,slot,index+1,r,g,b)
    // bot.rgbledDisplay(port,slot,index+2,r,g,b)
    // bot.rgbledDisplay(port,slot,index+3,r,g,b)
    // bot.rgbledShow(port,slot)

    bot.sevenSegmentDisplay(3, 0.1);
}

function updateServos(servo1, servo2){
    bot.servoRun(5,1,servo1);
    bot.servoRun(5,2,servo2);
}