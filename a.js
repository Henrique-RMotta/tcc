let datadia = new Date;
let a = true;
function exibirHorario() {
    setInterval(() => {
        console.log (`${datadia.getDate()}/${datadia.getMonth()}/${datadia.getFullYear()},${datadia.getHours()}:${datadia.getMinutes()},${datadia.getSeconds()}`)
    }, 1000);
    
}
while (a = true) {
    exibirHorario()
}
