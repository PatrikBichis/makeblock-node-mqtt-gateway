import { deviceType } from "./deviceTypes";
import { rgbled } from "./rgbled";

export function device(board, port, type){
    this.port = port;
    this.board = board;
    this.type = type;
    this.color = {r:0, g:0, b:0}
    this.blink = true;
    this.updateRate = 500; // ms

    var updateCount = 0;
    var showBlink = false;
    var noColor = {r:0, g:0, b:0}

    this.update = () => {
        if(timeToUpdate()){
            if(type == deviceType.RGB_LED) {
                if(this.blink && !showBlink){
                    rgbled.update(this.board, this.port, noColor);
                    showBlink = true;
                }else{ 
                    rgbled.update(this.board, this.port, this.color);
                    showBlink = false;
                }
            }
        }
    }

    function timeToUpdate(){
        if(updateCount >= this.updateRate){
            updateCount = 0;
            return true;
        }else{
            updateCount = updateCount + 100;
            return false;
        }
    }
}