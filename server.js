const express = require('express');
const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;

const led1 = new Gpio(17,{mode:Gpio.OUTPUT})

app.use(express.static('HTML'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/HTML/teste.html');
});

app.post('/ledligar', (req, res) => {
    led1.digitalWrite(1);
    res.send("Led Ligado!")
})

app.post('/leddesligar', (req, res) => {
    led1.digitalWrite(0);
    res.send("Led Desligado!")
})


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})
