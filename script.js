let contadorEditar = 0;
let novasenha = [];
let diaescolhido = "";
let contadorFunçãoVoltar = 0;
let id_remedio = null;
verCadastro();
setInterval(() => {
  const agora = new Date();
  let horaStr = agora.getHours().toString().padStart(2, "0");
  let minStr = agora.getMinutes().toString().padStart(2, "0");
  document.getElementById("hora1").innerHTML = `<span>${horaStr[0]}</span>`;
  document.getElementById("hora2").innerHTML = `<span>${horaStr[1]}</span>`;
  document.getElementById("min1").innerHTML = `<span>${minStr[0]}</span>`;
  document.getElementById("min2").innerHTML = `<span>${minStr[1]}</span>`;
  let p = document.getElementById("datahoje");
  let mes = agora.getMonth() + 1; // getMonth() retorna 0-11, então soma 1
  let nomeMes = "";
  switch (mes) {
    case 1:
      nomeMes = "Janeiro";
      break;
    case 2:
      nomeMes = "Fevereiro";
      break;
    case 3:
      nomeMes = "Março";
      break;
    case 4:
      nomeMes = "Abril";
      break;
    case 5:
      nomeMes = "Maio";
      break;
    case 6:
      nomeMes = "Junho";
      break;
    case 7:
      nomeMes = "Julho";
      break;
    case 8:
      nomeMes = "Agosto";
      break;
    case 9:
      nomeMes = "Setembro";
      break;
    case 10:
      nomeMes = "Outubro";
      break;
    case 11:
      nomeMes = "Novembro";
      break;
    case 12:
      nomeMes = "Dezembro";
      break;
    default:
      nomeMes = "Mês inválido";
  }
  p.innerHTML = `${agora.getDate()} de ${nomeMes} de ${agora.getFullYear()}`;
}, 10000);

/*async function ligaled () {
    const res = await fetch(`/ledligar`, {method: 'POST'});
    let data = await res.text();

}

async function desligarled() {
    const res = await fetch(`/leddesligar`, {method: 'POST'});
    let data = await res.text();
}*/

function menu() {
  setTimeout(() => {
    window.location.href = "menu.html";
  }, 1000);
}

async function verSenha() {
  const res = await fetch("/verSenha", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  let data = await res.json();
  senhacorreta.push(data.senha);
}
verSenha();
const senhacorreta = [];
let senhadigitada = [];

document.getElementById("menu").classList.add("hidden");
function add(num) {
  senhadigitada.push(num);
  const botoes = document.querySelectorAll("#senha button");
  botoes.forEach((btn) => {
    if (btn.innerText == num.toString()) {
      btn.classList.add("pressionado");
    }
  });
}

function verificar() {
  let senhadigitadajoin = senhadigitada.join("");
  let senhacorretajoin = senhacorreta.join("");
  const correta = senhadigitadajoin === senhacorretajoin;
  console.log(senhacorretajoin, senhadigitadajoin);
  if (correta) {
    senhadigitada = [];
    document.getElementById("senha").classList.add("hidden");
    document.getElementById("cancelar").classList.add("hidden");
    document.getElementById("titulo-senha").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("voltar").classList.remove("hidden");
  } else {
    senhadigitada = [];
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("voltar").classList.add("hidden");
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
  }
}

function addnova(num) {
  novasenha.push(num);
  const botoes = document.querySelectorAll("#senha button");
  botoes.forEach((btn) => {
    if (btn.innerText == num.toString()) {
      btn.classList.add("pressionado");
    }
  });
}
function alterarSenhaMenu() {
  contadorFunçãoVoltar = 0;
  document
    .querySelectorAll("#senha")
    .forEach((btn) => btn.classList.remove("hidden"));
  document
    .querySelectorAll("#botoes")
    .forEach((btn) => btn.classList.add("hidden"));
  document.getElementById("titulo-senha").classList.remove("hidden");
  if (novasenha.length > 6) {
    novasenha = [];
    let msg = document.getElementById("msg");
    msg.innerHTML = "Muitos Números (Máximo 6 números), senha não cadastrada";
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
    document.getElementById("voltar").classList.add("hidden");
  } else if (novasenha.length <= 6 && novasenha.length >= 4) {
    alterarSenha();
    let msg = document.getElementById("msg");
    msg.innerHTML = "cadastrada";
    setTimeout(() => {
      window.location.href = "página_inicial.html";
    }, 5000);
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
  }
}
async function alterarSenha() {
  let senhanova = novasenha.join("");
  
  fetch("/alterarSenha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senhanova }),
  });
}
function remover() {
  senhadigitada = [];
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}
function removernova() {
  novasenha = [];
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}
function programar() {
  setTimeout(() => {
    window.location.href = "programar.html";
    document.getElementById("teclado").classList.add("hidden");
  }, 1);
}

function verhorarios() {
  setTimeout(() => {
    window.location.href = "verhorarios.html";
  }, 1);
  verCadastro();
}

function configurar() {
  setTimeout(() => {
    window.location.href = "configurar.html";
  }, 1);
}

function cancelar() {
  setTimeout(() => {
    window.location.href = "página_inicial.html";
  }, 1);
}
document.getElementById("teclado").classList.add("hidden");

function addDia(dia) {
  diaescolhido= dia;
  contadorFunçãoVoltar = 0; // Reseta o contador ao escolher um dia
  document
    .querySelectorAll("#botoes")
    .forEach((btn) => btn.classList.add("hidden"));
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.remove("hidden"));
  document.getElementById("teclado").classList.add("hidden");
}

function  voltarProgramar() {
  // Esconde todos os inputs
  document.querySelectorAll(".inputs").forEach((el) => el.classList.add("hidden"));
  // Mostra os botões de dias
  document.querySelectorAll("#botoes").forEach((el) => el.classList.remove("hidden"));
  // Esconde a mensagem
  document.getElementById("msg").classList.add("hidden");

  contadorFunçãoVoltar++;

  // Se o usuário clicar duas vezes em voltar, volta para a página anterior
  if (contadorFunçãoVoltar === 2) {
    // Verifica se todos os inputs estão hidden
    const inputs = document.getElementsByClassName("inputs");
    let todosHidden = true;
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].classList.contains("hidden")) {
        todosHidden = false;
        break;
      }
    }
    if (todosHidden) {
      window.history.back();
    }
    contadorFunçãoVoltar = 0;
  }
}

function voltarConfigurar() {
   document
    .querySelectorAll("#botoes")
    .forEach((btn) => btn.classList.remove("hidden")); 
  document
    .querySelectorAll("#senha")
    .forEach((btn) => btn.classList.add("hidden")); 
  document.getElementById("titulo-senha").classList.add("hidden");
  contadorFunçãoVoltar ++;
  const botoesSenha = document.getElementById("senha"); 
  if (botoesSenha.classList.contains("hidden")){
    if (contadorFunçãoVoltar == 2) {
      window.history.back();
      contadorFunçãoVoltar = 0;
    }
  }
}

function voltarVerHorarios(){

}

async function programar2() {
  const nome = document.getElementById("nome1").value;
  const slot = parseInt(document.getElementById("slot1").value);
  const horaMinuto = document.getElementById("hora1").value;
  const [hora, minuto] = horaMinuto.split(":").map(Number);
  const nome2 = document.getElementById("nome2").value;
  const slot2 = parseInt(document.getElementById("slot2").value);
  const horaMinuto2 = document.getElementById("hora2").value;
  const [hora2, minuto2] = horaMinuto2.split(":").map(Number);
  const nome3 = document.getElementById("nome3").value;
  const slot3 = parseInt(document.getElementById("slot3").value);
  const horaMinuto3 = document.getElementById("hora3").value;
  const [hora3, minuto3] = horaMinuto3.split(":").map(Number);
  const nome4 = document.getElementById("nome4").value;
  const slot4 = parseInt(document.getElementById("slot4").value);
  const horaMinuto4 = document.getElementById("hora4").value;
  const [hora4, minuto4] = horaMinuto4.split(":").map(Number);

  if (nome != "" &&  !isNaN(slot) && horaMinuto != "") {
    const res = await fetch("/addRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, dia:diaescolhido, hora, minuto, slot }),
    });
    let data = await res.text();
    document.getElementById("nome1").value = "";
    document.getElementById("slot1").value = "";
    document.getElementById("hora1").value = "";
    document.getElementById("msg").innerHTML =data 
  }else if (nome2 != "" && !isNaN(slot2) && horaMinuto2 != "") {
    const res = await fetch("/addRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome:nome2, dia:diaescolhido, hora:hora2, minuto:minuto2, slot:slot2 }),
    });
    let data = await res.text();
    document.getElementById("nome2").value = "";
    document.getElementById("slot2").value = "";
    document.getElementById("hora2").value = "";
    document.getElementById("msg").innerHTML = data
    setTimeout(() => {
      document.getElementById("msg").innerHTML = "";
    }, 10000);
  } else if (nome3 != "" && !isNaN(slot3) && horaMinuto3 != "") {
    const res = await fetch("/addRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome:nome3, dia:diaescolhido, hora:hora3, minuto:minuto3, slot:slot3 }),
    });
    let data = await res.text();
    document.getElementById("msg").innerHTML = data
    document.getElementById("nome3").value = "";
    document.getElementById("slot3").value = "";
    document.getElementById("hora3").value = "";
    setTimeout(() => {
      document.getElementById("msg").innerHTML = "";
    }, 10000);
  } else if (nome4 != "" && !isNaN(slot4) && horaMinuto4 != "") {
    const res = await fetch("/addRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome:nome4, dia:diaescolhido, hora:hora4, minuto:minuto4, slot:slot4 }),
    });
    let data = await res.text();
    document.getElementById("nome4").value = "";
    document.getElementById("slot4").value = "";
    document.getElementById("hora4").value = "";
    document.getElementById("msg").innerHTML = data
    setTimeout(() => {
      document.getElementById("msg").innerHTML = "";
    }, 10000);
  }
}

let inputAtivo = null;
// Mostrar teclado quando o input for selecionado
function setInput(id) {
  inputAtivo = document.getElementById(id);
  document.getElementById("teclado").classList.remove("hidden");
}

// Esconder teclado quando clicar fora do input
document.addEventListener("click", (e) => {
  if (!e.target.closest("#teclado") && !e.target.closest("#inputs")) {
    document.getElementById("teclado").classList.add("hidden");
    inputAtivo = null;
  }
});

// Eventos dos inputs
document
  .getElementById("nome")
  .addEventListener("focus", () => setInput("nome"));
document
  .getElementById("hora")
  .addEventListener("focus", () => setInput("hora"));

// Teclado virtual
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", () => {
    if (!inputAtivo) return;
    if (key.classList.contains("space")) {
      inputAtivo.value += " ";
    } else {
      inputAtivo.value += key.textContent;
    }
  });
});

async function verCadastro (){
  const res = await fetch("/remediosCadastrados");
  const remedios = await res.json();

  const container = document.querySelector(".remediosCadastrados");
  container.innerHTML = ""; // Limpa antes de adicionar

  remedios.forEach(remedio => {
    const div = document.createElement("div");
    div.className = "remedioCadastrado";
    div.innerHTML = `
      <div id="remedioInfo">
        <p>
          Id: ${remedio.id} | Nome: ${remedio.nome} | Dia: ${remedio.dia} | Hora: ${remedio.hora.toString().padStart(2, "0")}:${remedio.minuto.toString().padStart(2, "0")} | Slot: ${remedio.slot}
        </p>
      </div>
      <button onclick="abrirEditar(${remedio.id})">
        <img src="https://cdn.discordapp.com/attachments/1132706730900459601/1421598752770097265/image.png?ex=68d99e82&is=68d84d02&hm=ee4fe9d639fe593e1ed4d38773b570d30f13ec7c98db2826633ff7efc07d409b&" alt="Editar" />
      </button>
      <button onclick="remover(${remedio.id})">
        <img src="https://cdn.discordapp.com/attachments/1132706730900459601/1421598915576336516/image.png?ex=68d99ea9&is=68d84d29&hm=cd1f761c25146711a1c45a211d96af65adf2e8ed83c4fd0402f6b1e231e7b7af&" alt="Remover" />
      </button>
    `;
    container.appendChild(div);
  });
  contadorEditar = 0; 
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.add("hidden")); 
}

// Chame a função ao carregar a página verhorarios.html
if (window.location.pathname.includes("verhorarios.html")) {
  verCadastro();
}

async function remover(remedio) {
    const res = await fetch ( "/removerRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({remedio}),
    });
    verCadastro();
}


async function abrirEditar(remedioid) {
  console.log(contadorEditar)
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.remove("hidden")); 
  document
  .querySelectorAll(".remediosCadastrados")
  .forEach((card)=> card.classList.add("hidden"))
  contadorEditar ++; 
  let resCadastro = await fetch(`/remedioCadastrado?id=${remedioid}`, {
  method: "GET",
  headers: { "Content-Type": "application/json" }
});
  const remedios = await resCadastro.json();
  document.getElementById("nome-editar").value = remedios.nome;
  document.getElementById("slot-editar").value = remedios.slot;
  document.getElementById("dia-editar").value = remedios.dia;
  document.getElementById("hora-editar").value = remedios.hora.toString().padStart(2, "0") + ":"+ remedios.minuto.toString().padStart(2, "0");
  id_remedio = remedioid;
}
async function editar(){
  contadorEditar ++; 
  let nome1 = document.getElementById("nome-editar").value;
  let slot1 = parseInt(document.getElementById("slot-editar").value);
  let horaMinuto1 = document.getElementById("hora-editar").value;
  let dia  = document.getElementById("dia-editar").value;
  let [hora1, minuto1] = horaMinuto1.split(":").map(Number);
  console.log(contadorEditar)
  if (contadorEditar == 2) {
    const res = await fetch ("/editarRemedio",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id:id_remedio,nome:nome1, hora:hora1, minuto:minuto1,slot:slot1,dia}),
    
  });
  contadorEditar = 0; 
  document.getElementById("nome-editar").value = "";
  document.getElementById("slot-editar").value = "";
  document.getElementById("dia-editar").value = "";
  document.getElementById("hora-editar").value = "";
   document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.add("hidden")); 
   document
    .querySelectorAll(".remediosCadastrados")
    .forEach((el) => el.classList.remove("hidden")); 
    console.log(contadorEditar)
    id_remedio = null
    verCadastro();
    }
}
