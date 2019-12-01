import { deviceType } from "./deviceTypes";
import { rgbled } from "./rgbled";

export function device(board, port, type){
    this.port = port;
    this.board = board;
    this.type = type;
    this.color = {r:0, g:0, b:0}
    this.updateRate = 500; // ms

    var updateCount = 0;

    this.update = () => {
        if(timeToUpdate()){
            if(type == deviceType.RGB_LED) rgbled.update(this.board, this.port, this.color);
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