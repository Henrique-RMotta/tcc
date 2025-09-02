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
    led1.servoWrite(2000); // valor ~1.5ms → 90 graus
    res.status(200).send("Led Ligado!")
})

app.post('/leddesligar', (req, res) => {
    led1.servoWrite(1500);
    res.status(200).send("Led Desligado!")
})


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})
