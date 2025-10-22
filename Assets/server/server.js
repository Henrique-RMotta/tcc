const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const led1 = new Gpio(4,{mode:Gpio.OUTPUT});
const db = new sqlite3.Database('/home/mottaaryana/tcc/dispenser.db');
app.use(bodyParser.json())
// Banco de Dados  

db.run(`CREATE TABLE IF NOT EXISTS remedios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  dia TEXT NOT NULL,
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

app.post('/alterarSenha', (req,res) => {
  const { senhanova } = req.body;
  if (!senhanova) return res.status(400).send("Informe a nova senha");
  db.run("UPDATE senha set senha = ?",[senhanova],function(err) {
    if (err) {
      res.status(500).send("Erro ao trocar senha");
    } else {
      res.send("Senha alterada com sucesso!");
    }
  })
})
app.get('/verSenha',(req,res) => {
  db.get("SELECT senha from senha LIMIT 1", [], (err,row) => {
    if(err) return res.status(500).send("Erro no Banco de Dados");
    res.send(row);
  })
})
app.use(express.static('HTML'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/HTML/página_inicial.html');
});

app.post('/motorLigar', (req, res) => {
  const { posicao } = req.body;
  // Inicia rotação suave para um lado
  led1.servoWrite(1300); // velocidade leve e segura
  switch (posicao) {
    case "1":
      // Tempo calculado para ~45° com leve carga
     setTimeout(() => {
        led1.servoWrite(1500); // parar o servo
      }, 225); 
      break;
    
  }
  
   
  res.status(200).send("Servo girou aproximadamente 45°!");
});

app.post ('/motorTestar' , (req,res) => {
  led1.servoWrite(1300);
  setTimeout(() => {
        led1.servoWrite(1500); // parar o servo
      }, 224); 
})

app.post('/motorDesligar', (req, res) => {
    led1.servoWrite(1500);
    res.status(200).send("Motor Desligado!")
})


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})

app.post("/addRemedio", (req, res) => {
  const { nome, dia, hora, minuto,slot } = req.body;

  if (!nome || !dia || isNaN(hora) || isNaN(minuto) || !slot) {
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
        res.send(`Remédio Cadastrado: Id:${this.lastID}| Nome:${nome}| Dia:${dia}| Hora:${hora}:${minuto} | slot: ${slot}`);
      }
    }
  );
});


app.get("/remediosCadastrados", (req, res) => {
  db.all("SELECT * FROM remedios", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao buscar remédios");
    } else {
      res.json(rows);
    }
  });
});
app.get("/remedioCadastrado", (req, res) => {
  const { id } = req.query; // pega da query string ?id=123
  db.get("SELECT * FROM remedios WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no banco" });
    }
    res.json(row || {});
  });
});
app.get("/buscarRemedio", (req, res) => {
  const { dia, hora, minuto } = req.query;
 db.all(
  "SELECT * FROM remedios WHERE dia = ? AND hora = ? AND minuto = ?",
  [dia, hora, minuto],
  (err, rows) => { // <-- troquei para rows (plural)
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no banco de dados" });
    }

    if (!rows || rows.length === 0) {
      console.log("Remédio não encontrado");
      return res.status(404).json({ error: "Remédio não encontrado" });
    }
    let mensagemCompleta = "";
    for (let i = 0; i < rows.length; i++) {
      // Adiciona uma quebra de linha ou separador entre os itens, exceto no último
      mensagemCompleta += `<p>Id:${rows[i].id} | Nome:${rows[i].nome} | Dia:${rows[i].dia} | Hora:${rows[i].hora}:${rows[i].minuto} | Slot:${rows[i].slot}</p>`;
      if (i < rows.length - 1) {
          mensagemCompleta += " e "; 
      }
    }
    // Mensagem personalizada com os dados vindos do banco
    return res.status(200).json({
      message: mensagemCompleta
    });
  }
);
});

app.get ('buscarSlot', (req,res) => {
    // CORREÇÃO: Extrair as variáveis da query string (URL)
    const { dia, hora, minuto } = req.query; 

    // Opcional: Validar se as variáveis foram passadas
    if (!dia || !hora || !minuto) {
        return res.status(400).json({ error: "Faltam parâmetros: dia, hora, ou minuto." });
    }

    db.all ("Select * from remedios where dia = ? and hora = ? and minuto = ?", [dia,hora,minuto], (err,rows) => {
        if (err) {
            console.log(err)
            return res.status(500).json({ error: "Erro no banco de dados" });
        } 
        
        if (!rows || rows.length === 0) {
            console.log("Remédio não encontrado");
            return res.status(404).json({ error: "Remédio não encontrado" });
        } else {
            const slotsEncontrados = rows.map(row => row.slot);
            // Retorna o array de slots dentro do objeto { slotsEncontrados: [...] }
            return res.status(200).json({slotsEncontrados});
        }
    })
})


app.post ("/removerRemedio", (req,res) => {
  const { remedio } = req.body;
  db.run("delete from remedios where id = (?)", [remedio], function(err) {
    if (err){
      console.log(err.message);
      res.status(500).send("Erro ao remover o remédio !!");
  }else {
      res.send("Remédio removido !");
  }})
})

app.post("/editarRemedio", (req, res) => {
  const { id, nome, dia, hora, minuto, slot } = req.body;
  if (!id || !nome || !dia || isNaN(hora) || isNaN(minuto) || !slot) {
    return res.status(400).send("Preencha todos os campos");
  }
  db.run(
    "UPDATE remedios SET nome = ?, dia = ?, hora = ?, minuto = ?, slot = ? WHERE id = ?",
    [nome, dia, hora, minuto, slot, id],
    function (err) {
      if (err) {
        res.status(500).send("Erro ao editar remédio");
      } else {
        res.send("Remédio editado com sucesso!");
      }
    }
  );
});

