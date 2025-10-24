const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const Gpio = require('pigpio').Gpio;
const app = express();
const porta = 3000;
const bodyParser = require('body-parser');
const led1 = new Gpio(4,{mode:Gpio.OUTPUT});
const buzzer = new Gpio(26, {mode:Gpio.OUTPUT});
const db = new sqlite3.Database('/home/mottaaryana/tcc/Assets/server/dispenser.db');
const path = require("path");
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
db.run(`CREATE TABLE IF NOT EXISTS modal (
  modalAberto Integer CHECK(modalAberto IN (0, 1)) default 0 
  )`);


app.listen(porta, () => {
    console.log("Servidor Iniciado em: http://192.168.0.97:3000/")
})
// Remove o 'Assets' do final
app.use(express.static(path.join(__dirname, '..')));
// CORREÇÃO: Certifique-se de incluir a pasta 'Assets' no caminho para o HTML
app.get("/", (req, res) => {
    const caminhoCompleto = path.join("/home/mottaaryana/tcc/Assets/HTML/pagina_inicial.html");
    console.log("Carregando:", caminhoCompleto);
    res.sendFile(caminhoCompleto);
});
app.get("/", (req, res) => {
    res.sendFile("/home/mottaaryana/tcc/Assets/HTML/pagina_inicial.html");
});

app.get("/menu", (req, res) => {
    res.sendFile("/home/mottaaryana/tcc/Assets/HTML/menu.html");
});

// Adiciona para todas as outras páginas que você tem
app.get("/configurar", (req, res) => {
    res.sendFile("/home/mottaaryana/tcc/Assets/HTML/configurar.html");
});

app.get("/programar", (req, res) => {
    res.sendFile("/home/mottaaryana/tcc/Assets/HTML/programar.html");
});

app.get("/verhorarios", (req, res) => {
    res.sendFile("/home/mottaaryana/tcc/Assets/HTML/verhorarios.html");
});
// Agora faz a verificação com segurança
db.get("SELECT COUNT(*) as contador FROM senha", [], (err, row) => {
  if (err) {
    console.error("Erro ao contar senhas:", err);
    return;
  }

  if (row && row.contador === 0) {
    db.run("INSERT INTO senha (senha) VALUES (?)", ["1234"], (err) => {
      if (err) {
        console.error("Erro ao inserir senha padrão:", err);
      } else {
        console.log("Senha padrão '1234' criada com sucesso!");
      }
    });
  } else {
    console.log("Senha já existente ou tabela acessível com sucesso.");
  }
});
let buzzerInterval = null;
app.post('/buzzer' , (req,res) => {
    if (buzzerInterval) {
    return res.status(200).send("Buzzer já está tocando");
  }
   buzzerInterval = setInterval(() => {
    buzzer.digitalWrite(1);
    setTimeout(() => buzzer.digitalWrite(0), 300); // apita por 0.3s
  }, 1000); // repete a cada 1s
  res.status(200).send("Buzzer Ligado");
}) 

app.post (`/buzzerDesligar`, (req,res) => {
  if (buzzerInterval) {
    clearInterval(buzzerInterval); // para o loop
    buzzerInterval = null;
  }
  buzzer.digitalWrite(0);
  res.status(200).send("Buzzer Desligado");
} )


// abrirModal: seta modalAberto = 1 (ok)
app.post('/abrirModal', (req,res) => {
  db.run("UPDATE modal SET modalAberto = 1", [], function(err) {
    if (err) {
      console.log(err);
      res.status(500).send("Erro ao setar o modal");
    } else {
      res.status(200).send("Modal aberto !");
    }
  })
})

// verificarModal: rota com '/' e retorna JSON seguro
app.get('/verificarModal', (req,res) => {
  db.get('SELECT * FROM modal LIMIT 1', [], (err,row) =>{
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Erro ao verificar o estado do modal" });
    }
    // Se não existir linha, retorne objeto padrão
    if (!row) return res.status(200).json({ modalAberto: row ?  row.modalAberto :  0 });
    return res.status(200).json({ modalAberto: row.modalAberto });
  })
})

// opcional: endpoint para limpar/resetar modal (fechar)
app.post('/fecharModal', (req, res) => {
  db.run("UPDATE modal SET modalAberto = 0", [], function(err) {
    if (err) return res.status(500).send("Erro ao fechar modal");
    res.status(200).send("Modal fechado");
  });
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


app.post('/motorLigar', (req, res) => {
 /* const { posicao } = req.body; -- ESTE É O CODIGO COMO DEVERIA SER

  // Velocidade leve para abertura
  led1.servoWrite(1300); // sentido horário

  switch (posicao) {
    case "1":
      setTimeout(() => {
        led1.servoWrite(1500); // para
        setTimeout(() => {
          led1.servoWrite(1700); // volta (anti-horário)
          setTimeout(() => led1.servoWrite(1500), 266); // para
        }, 1000);
      }, 266);
      break;

    case "2":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 2);
        }, 1000);
      }, 266 * 2);
      break;

    case "3":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 3);
        }, 1000);
      }, 266 * 3);
      break;

    case "4":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 4);
        }, 1000);
      }, 266 * 4);
      break;

    case "5":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 5);
        }, 1000);
      }, 266 * 5);
      break;

    case "6":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 6);
        }, 1000);
      }, 266 * 6);
      break;

    case "7":
      setTimeout(() => {
        led1.servoWrite(1500);
        setTimeout(() => {
          led1.servoWrite(1700);
          setTimeout(() => led1.servoWrite(1500), 266 * 7);
        }, 1000);
      }, 266 * 7);
      break;

    default:
      console.log("Posição inválida recebida:", posicao);
      res.status(400).send("Posição inválida!");
      return;
  }

  res.status(200).send(`Servo girou para posição ${posicao} e retornou.`);*/
});


app.post ('/motorFeira' , (req,res) => {
  led1.servoWrite(1300);
   setTimeout(() => {
    led1.servoWrite(1500); // para
    // pequena pausa antes de retornar
    setTimeout(() => {
      // Gira suavemente de volta (45° no outro sentido)
      led1.servoWrite(1700); // sentido anti-horário
      setTimeout(() => {
        led1.servoWrite(1500); // para novamente
      }, 278*5); // tempo igual pra retornar
    }, 1000); // pausa de 150ms antes de começar a voltar
  }, 270*6); // tempo do giro de 45° (ajustável)
    
  res.status(200).send("Servo girou tudo e retornou à posição inicial!");
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
        res.send(`Remédio Cadastrado: Id:${this.lastID}| Nome:${nome}| Dia:${dia}| Hora:${hora.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")} | slot: ${slot}`);
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
      mensagemCompleta += `<p>Id:${rows[i].id} | Nome:${rows[i].nome} | Dia:${rows[i].dia} | Hora:${rows[i].hora.toString().padStart(2, "0")}:${rows[i].minuto.toString().padStart(2, "0")} | Slot:${rows[i].slot}</p>`;
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

