// Inicializando algumas variáveis
let contadorEditar = 0;
let diaescolhido = "";
let contadorFunçãoVoltar = 0;
let id_remedio = null;
let novasenha = [];
const senhacorreta = [];
let senhadigitada = [];
let cairRemedios = [];
verCadastro();

// Verficador de horário
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
  buscarRemedio();
}, 10000);

// Função que busca o remédio a cada 10 segundos
async function buscarRemedio() {
  const agora = new Date();
  const diaNum = agora.getDay();
  let diaSem = "";
  switch (diaNum) {
    case 1:
      diaSem = "segunda";
      break;
    case 2:
      diaSem = "terca"
      break;
    case 3: 
      diaSem = "quarta";
      break; 
    case 4: 
      diaSem = "quinta";
      break;
    case 5: 
      diaSem = "sexta";
      break;
    case 6: 
      diaSem = "sabado"
      break
    case 0: 
      diaSem = "domingo"
      break;

}
  const hora = agora.getHours();
  const minuto = agora.getMinutes();
  const res = await fetch (`/buscarRemedio?dia=${diaSem}&hora=${hora}&minuto=${minuto}`,{
    method: "GET",
    headers: {"Content-Type":"application/json"},
  });
  let data = await res.json();
  const modal = document.getElementById("modal-overlay");
  if (res.status === 200) {
    modal.style.display = "flex";
    const div = `  <div class="modal">
              <h2>Aviso</h2>
              <h3>O seguinte remédio está sendo despejado !</h3>
              <div id="remedio-modal"></div>
              <button class="btn-fechar" onclick="fecharModal()">Fechar</button>
          </div>`
    modal.innerHTML = div;
    document.getElementById("remedio-modal").innerHTML = data.message
    console.log(cairRemedios);
    console.log(data.message);
  }
  
 }
function fecharModal() {
  const modal = document.getElementById("modal-overlay");
  modal.style.display = "none";
  modal.innerHTML = "";
}
async function ligaLed () {
  const test = await fetch('motorTestar' , { method: 'POST'})
  const dataTest = await test.text();
  const agora = new Date();
  const diaNum = agora.getDay();
  let diaSem = "";
  switch (diaNum) {
    case 1:
      diaSem = "segunda";
      break;
    case 2:
      diaSem = "terca"
      break;
    case 3: 
      diaSem = "quarta";
      break; 
    case 4: 
      diaSem = "quinta";
      break;
    case 5: 
      diaSem = "sexta";
      break;
    case 6: 
      diaSem = "sabado"
      break
    case 0: 
      diaSem = "domingo"
      break;

}
   const hora = agora.getHours();
  const minuto = agora.getMinutes();
    // 1. BUSCA a posição (slot) primeiro
    const resSlot = await fetch(`/buscarSlot?dia=${diaSem}&hora=${hora}&minuto=${minuto}`, {
        method: 'GET', 
        headers: { "Content-Type" : "application/json"} // Corrigido 'applcation' para 'application'
    });
    
    // Verifica se a busca foi bem-sucedida
    if (resSlot.status !== 200) {
        console.error("Erro ao buscar slot.");
        return; 
    }
    
    // Processa a resposta do slot (o backend retorna { slotsEncontrados: [...] })
    const dataSlot = await resSlot.json();
    
    // Pega o PRIMEIRO slot e usa-o como a 'posicao' que será enviada.
    // **NOTA:** Isso pressupõe que seu backend irá mapear "slot" (string) para "posicao" (número)
    // ou que o valor retornado já é o número.
    const posicao = dataSlot.slotsEncontrados ? dataSlot.slotsEncontrados[0] : null;

    if (!posicao) {
        console.log("Nenhum slot/posição encontrado.");
        return;
    }

    // 2. ENVIA a requisição POST para o motor, usando a posição recém-obtida
      const res = await fetch(`/motorLigar`, {
        method: 'POST', 
        headers: { "Content-Type": "application/json" }, // Necessário para enviar JSON
        body: JSON.stringify({ posicao: posicao }) 
    });
    
    let data = await res.text();
    console.log(data); // Adicionado para ver a resposta do motor
}


/*async function desligarled() {
    const res = await fetch(`/leddesligar`, {method: 'POST'});
    let data = await res.text();
}*/

// Função que puxa a senha cadastrada
async function verSenha() {
  const res = await fetch("/verSenha", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  let data = await res.json();
  senhacorreta.push(data.senha);
}
verSenha();
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

// Função que verifica se a senha está correta
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

// Função que adiciona a senha digitada 
function addnova(num) {
  novasenha.push(num);
  const botoes = document.querySelectorAll("#senha button");
  botoes.forEach((btn) => {
    if (btn.innerText == num.toString()) {
      btn.classList.add("pressionado");
    }
  });
}

// Funçõa para alterar a senha
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
    }, 2000);
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
  }
}

// Função que manda a senha alterada ao banco de dados 
async function alterarSenha() {
  let senhanova = novasenha.join("");
  
  fetch("/alterarSenha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senhanova }),
  });
}

// função que remove os botões selecionados
function remover() {
  senhadigitada = [];
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}

// função que remove os botões selecionados
function removernova() {
  novasenha = [];
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}

//Função que redireciona para as páginas desejadas
function Redirecionador(direcao) {
  switch (direcao){
    case 'Programar':
    window.location.href = "programar.html";
    document.getElementById("teclado").classList.add("hidden");
    break;
    case 'VerHorarios':
    window.location.href = "verhorarios.html";
    verCadastro();
    break
    case 'Configurar':
    window.location.href = "configurar.html";
    break;
    case 'Cancelar':
    window.location.href = "página_inicial.html";
    break;
    case 'Menu':
    window.location.href = "menu.html";
    break;
}
}

// função que adiciona o dia selecionado na programação dos remédios
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

//  funções para voltar o programa
function  voltarProgramar() {
   const inputsVisiveis = [...document.querySelectorAll(".inputs")]
    .some((el) => !el.classList.contains("hidden"));
   if (inputsVisiveis) {
    document.querySelectorAll(".inputs").forEach((el) => el.classList.add("hidden"))
    document.querySelectorAll("#botoes").forEach((el) => el.classList.remove("hidden"))
    contadorFunçãoVoltar = 0; // 🔴 resetar contador aqui
    return; // não sai da página ainda
   }

   contadorFunçãoVoltar ++; 
   if(contadorFunçãoVoltar >= 1) {
    window.history.back();
    contadorFunçãoVoltar = 0;
   }
}


function voltarConfigurar() {
    const senha = [...document.querySelectorAll("#senha")]
    .some((el) => !el.classList.contains("hidden"));

    if(senha) {
    document.querySelectorAll("#senha").forEach((el) => el.classList.add("hidden"))
    document.getElementById("titulo-senha").classList.add("hidden");
    document.querySelectorAll("#botoes").forEach((el) => el.classList.remove("hidden"))
    contadorFunçãoVoltar = 0; // 🔴 resetar contador aqui
    return; // não sai da página ainda
    }
    contadorFunçãoVoltar ++; 
    if(contadorFunçãoVoltar >= 1) {
    window.history.back();
    contadorFunçãoVoltar = 0;
   }
}


function voltarVerHorarios(){
  // Se estamos editando (inputs visíveis)
  const inputsVisiveis = [...document.querySelectorAll(".inputs")]
    .some((el) => !el.classList.contains("hidden"));

  if (inputsVisiveis) {
    // Fecha edição e volta para lista
    document.querySelectorAll(".inputs").forEach((el) => el.classList.add("hidden"));
    document.querySelectorAll(".remediosCadastrados").forEach((el) => el.classList.remove("hidden"));
    contadorFunçãoVoltar = 0; // 🔴 resetar contador aqui
    return; // não sai da página ainda
  }

  // Se já estamos na lista
  contadorFunçãoVoltar++;
  if (contadorFunçãoVoltar >= 1) { // 🔴 basta 1 clique
    window.history.back();
    contadorFunçãoVoltar = 0;
}
}

// função para programar o remédio 
function programar() {
  const agora = new Date();
  const horaNow = agora.getHours();
  const minutoNow = agora.getMinutes();
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
  document.getElementById("hora1").value = `${horaNow}:${minutoNow+1}`
  document.getElementById("hora2").value = `${horaNow}:${minutoNow+1}`
  document.getElementById("hora3").value = `${horaNow}:${minutoNow+1}`
  document.getElementById("hora4").value = `${horaNow}:${minutoNow+1}`
  if (nome != "" &&  !isNaN(slot) && horaMinuto != "") {
    EnviarProgramar(nome,hora,minuto,slot);
    document.getElementById("nome1").value = "";
    document.getElementById("slot1").value = "";
    document.getElementById("hora1").value = "";
  }else if (nome2 != "" && !isNaN(slot2) && horaMinuto2 != "") {
    EnviarProgramar(nome2,hora2,minuto2,slot2)
    document.getElementById("nome2").value = "";
    document.getElementById("slot2").value = "";
    document.getElementById("hora2").value = "";
  } else if (nome3 != "" && !isNaN(slot3) && horaMinuto3 != "") {
    EnviarProgramar(nome3,hora3,minuto3,slot3)
    document.getElementById("nome3").value = "";
    document.getElementById("slot3").value = "";
    document.getElementById("hora3").value = "";
  } else if (nome4 != "" && !isNaN(slot4) && horaMinuto4 != "") {
    EnviarProgramar(nome4,hora4,minuto4,slot4)
    document.getElementById("nome4").value = "";
    document.getElementById("slot4").value = "";
    document.getElementById("hora4").value = "";
  }
}

// Função para enviar ao banco de dados o dado programdo
async function EnviarProgramar(nome,hora,minuto,slot) {
   const res = await fetch("/addRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome:nome, dia:diaescolhido, hora:hora, minuto:minuto, slot:slot }),
    });
    let data = await res.text();
    document.getElementById("msg").innerHTML =data 
    setTimeout(() => {
      document.getElementById("msg").innerHTML = "";
    }, 10000);
}

// Função para ver os remedios cadastrados
async function verCadastro (){
  contadorFunçãoVoltar = 0;
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
      <button onclick="removerRemedio(${remedio.id})">
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

// Função para remover o remedio
async function removerRemedio(remedio) {
    const res = await fetch ( "/removerRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({remedio}),
    });
    verCadastro();
}

// função para abrir o menu de editar
async function abrirEditar(remedioid) {
  contadorFunçãoVoltar=  0; 
  console.log(contadorFunçãoVoltar)
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

// função para enviar o remedio editado ao banco de dados
async function editar(){
  contadorEditar ++; 
  let nomeEditado = document.getElementById("nome-editar").value;
  let slotEditado = parseInt(document.getElementById("slot-editar").value);
  let horaMinuto = document.getElementById("hora-editar").value;
  let dia  = document.getElementById("dia-editar").value;
  let [hora, minuto] = horaMinuto.split(":").map(Number);
  console.log(contadorEditar)
  if (contadorEditar == 2) {
    const res = await fetch ("/editarRemedio",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id:id_remedio,nome:nomeEditado, hora:hora, minuto:minuto,slot:slotEditado,dia}),
    
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