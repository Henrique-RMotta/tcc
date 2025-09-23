const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const led1 = new Gpio(17,{mode:Gpio.OUTPUT});
const db = new sqlite3.Database('/home/mottaaryana/tcc/dispenser.db');
app.use(bodyParser.json())
// Banco de Dados  

db.run(`CREATE TABLE IF NOT EXISTS remedios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  dia INTEGER NOT NULL,
  hora INTEGER NOT NULL,
  minuto INTEGER NOT NULL,
  slot INTEGER NOT NULL
)`);

db.run(`CREATE TABLE IF NOT EXISTS senha (
  senha INTEGER NOT NULL
  ) `);

db.get("SELECT COUNT(*) as contador FROM senha", [], (err,row) => {
  if (row.contador === 0) {
    db.run("INSERT INTO senha (senha) VALUES(?)", ["1234"]);
  }
});
app.get("/verSenha",(req,res) => {
  db.get("SELECT senha from senha LIMIT 1", [], (err,row) => {
    if(err) return res.status(500).send("Erro no Banco de Dados");
    res.send(row);
  })
})
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

app.post("/addRemedio", (req, res) => {
  const { nome, dia, hora, minuto,slot } = req.body;

  if (!nome || !dia || !hora || !minuto || !slot) {
    return res.status(400).send("Preencha todos os campos");
  }

  db.run(
    `INSERT INTO remedios (nome, dia, hora, minuto,slot) VALUES (?, ?, ?, ?,?)`,
    [nome, dia, hora, minuto,slot],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).send("Erro ao cadastrar remédio");
      } else {
        res.send(`Remédio ${nome} cadastrado com ID ${this.lastID}`);
      }
    }
  );
});
