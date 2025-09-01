const express = require('express');
const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;

const led1 = new Gpio(17,{mode:Gpio.OUTPUT});
// 1500 = posição central (~90°), 1000 = ~0°, 2000 = ~180°
app.use(express.static('HTML'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/HTML/teste.html');
});

app.post('/ledligar', (req, res) => {
    led1.servoWrite(1); // Set to central position (~90°)
    res.send("Led Ligado!")
})

app.post('/leddesligar', (req, res) => {
    led1.servoWrite(0); // Set to ~0° position
    res.send("Led Desligado!")
})


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})
