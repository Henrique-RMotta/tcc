

let Gpio = require('onoff').Gpio; 
let led = new Gpio(4,out);

function led(){
    if (led.readSync() === 0){
        led.writeSync(1);
    }
}

function leddesligar(){
    if(led.readSync() === 1){
        led.writeSync(0);
    }
}
