const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;

const led1 = new Gpio(17,{mode:Gpio.OUTPUT});

// 1500 = posição central (~90°), 1000 = ~0°, 2000 = ~180°
app.use(express.static('HTML'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/HTML/página_inicial.html');
});
app.post('/ledligar', (req, res) => {
// girar para um lado com velocidade média (ex.: 1200)
  led1.servoWrite(1500);
  led1.servoWrite(1200);
  setTimeout(() => {
  // parar após X ms (por exemplo 700 ms para ~uma volta curta, ajuste por teste)
  led1.servoWrite(1500);
  }, 510);
  // Depois de 500ms (meio segundo), manda para 90
  res.status(200).send("Servo girou 90°!");
});

app.post('/leddesligar', (req, res) => {
    led1.servoWrite(1500);
    res.status(200).send("Led Desligado!")
})


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})

