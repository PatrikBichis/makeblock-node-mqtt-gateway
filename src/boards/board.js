const MegaPi = require("../megapi").MegaPi;
var bot = undefined;
var client = undefined;

export function board(id, type, port){
    // Array for all connected devices to the board
    this.devices = [];
    // Connection status 
    this.connected = false;
    // Type of board
    this.board = "";
    // Port to use
    this.port = "";
    // Id of board
    this.id = "";

    this.connect = function() {
        try {
            bot = new MegaPi(this.port, ()=>{
                console.log("Connected to bot, will start in 3 sec.")
                this.connect = true;
                
                setTimeout(()=>{
                    // updateRGBLed();
                    // updateServos(100,20);

                    start();

                    if(client) client.publish('makeblock/'+this.board+'/'+this.id+'/status/conencted', 'true');
                },3000);
                return true;
            });

        }catch(err){
            if(client) client.publish('makeblock/'+this.board+'/'+this.id+'/status/conencted', 'false');
            return false;
        }
    }

    this.init = function(){
        this.board = type;
        this.port = port;
        this.id = id;

        if(type != ""){
            if(type == "orion"){
                connect();
            }
        }
    }

    function loop(){
        this.devices.array.forEach(device => {
            device.read();
        });
    }
    
    function start(){
        setInterval(loop,100);
    }

    init();
}