// Autor: (Henrique Motta)


 // Inicializando algumas variáveis globais usadas em várias funções
let contadorEditar = 0;        // contador usado para controlar fluxo de edição
let diaescolhido = "";        // dia selecionado ao programar um remédio (string)
let contadorFunçãoVoltar = 0; // contador usado para confirmar ação de "voltar"
let id_remedio = null;        // id do remédio atualmente em edição
let novasenha = [];           // array temporário para montar nova senha digitada
const senhacorreta = [];      // senha correta carregada do backend (guardada como string/array)
let senhadigitada = [];       // dígitos que o usuário digitou no teclado de senha
let modalAberto = false;      // flag para evitar abrir múltiplos modais simultâneos
let ultimoRemedio = null;     // guarda último remédio exibido no modal para evitar repetições

// Busca e renderiza a lista de remédios cadastrados ao carregar o script
verCadastro();


// --------------------- Relógio e atualização de data ---------------------
// Loop que atualiza a tela principal (hora/mostrar data) a cada segundo quando estamos na página inicial.
setInterval(() => {
  if (document.body.id === "paginaInicial") {
    const agora = new Date();
    // Formata hora e minuto com 2 dígitos
    let horaStr = agora.getHours().toString().padStart(2, "0");
    let minStr = agora.getMinutes().toString().padStart(2, "0");
    // Atualiza os "leds" individuais (ex.: hora1, hora2, min1, min2)
    document.getElementById("hora1").innerHTML = `<span>${horaStr[0]}</span>`;
    document.getElementById("hora2").innerHTML = `<span>${horaStr[1]}</span>`;
    document.getElementById("min1").innerHTML = `<span>${minStr[0]}</span>`;
    document.getElementById("min2").innerHTML = `<span>${minStr[1]}</span>`;

    // Converte o número do mês para nome por extenso e atualiza a tag de data
    let p = document.getElementById("datahoje");
    let mes = agora.getMonth() + 1; // getMonth() retorna 0-11
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

    // Exibe data formatada: "dia de NomeDoMes de ano"
    p.innerHTML = `${agora.getDate()} de ${nomeMes} de ${agora.getFullYear()}`;
  }
}, 1000);

// Busca de remédio programado (função que checa banco/servidor a cada 10s)
setInterval(buscarRemedio, 10000);

// --------------------- Busca de remédio programado ---------------------
// Essa função consulta o backend para saber se existe um remédio para o momento atual.
// Se houver, abre um modal e dispara o efeito (buzzer/motor).
async function buscarRemedio() {
  try {
    // checa se existe remédio para o momento
    const agora = new Date();
    const dias = ["domingo","segunda","terca","quarta","quinta","sexta","sabado"];
    const diaSem = dias[agora.getDay()];
    const hora = agora.getHours();
    const minuto = agora.getMinutes();

    const res = await fetch(`/buscarRemedio?dia=${diaSem}&hora=${hora}&minuto=${minuto}`, { method: "GET" });
    if (!res.ok) return; // sem remédio agora

    const data = await res.json();
    if (!data || !data.message) return;

    // supressão simples por minuto (cliente): não reabrir o mesmo aviso no mesmo minuto
    const KEY_MSG = "ultimoRemedioMsg";
    const KEY_MIN = "ultimoRemedioMin";
    const lastMsg = localStorage.getItem(KEY_MSG);
    const lastMin = parseInt(localStorage.getItem(KEY_MIN) || "-1", 10);
    if (lastMsg === data.message && lastMin === minuto) return;

    // grava tentativa de abertura (evita múltiplas aberturas nessa aba)
    ultimoRemedio = data.message;
    localStorage.setItem(KEY_MSG, data.message);
    localStorage.setItem(KEY_MIN, String(minuto));

    // mostra modal
    const modal = document.getElementById("modal-overlay");
    if (!modal) return;
    modalAberto = true;
    modal.style.display = "flex";
    modal.innerHTML = `
      <div class="modal">
        <h2>Aviso</h2>
        <h3>O seguinte remédio está sendo despejado !</h3>
        <div id="remedio-modal">${data.message}</div>
        <button class="btn-fechar" onclick="fecharModal()">Fechar</button>
      </div>`;

    // tenta marcar no servidor (melhor esforço) e acionar buzzer/motor
    fetch('/abrirModal', { method: 'POST' }).catch(() => {});
    fetch("/buzzer", { method: "POST" }).catch(() => {});
    ligamotor().catch(() => {});
  } catch (err) {
    console.error("buscarRemedio erro:", err);
  }
}

async function fecharModal() {
  try {
    const modal = document.getElementById("modal-overlay");
    if (modal) {
      modal.style.display = "none";
      modal.innerHTML = "";
    }
    modalAberto = false;
    // sinaliza ao backend que o modal foi fechado (mantém lastShown no cliente para supressão por minuto)
    fetch('/fecharModal', { method: 'POST' }).catch(() => {});
    fetch("/buzzerDesligar", { method: "POST" }).catch(() => {});
  } catch (err) {
    console.error("fecharModal erro:", err);
  }
}

// Exemplo de função que aciona motor (pode ser adaptada)
async function ligamotor() {
  const test = await fetch("/motorFeira", { method: "POST" });
  const dataTest = await test.text();
  // (Comentado) lógica alternativa caso queira enviar posição ao motor
  /*
  const agora = new Date();
  const diaNum = agora.getDay();
  const posicao = diaNum;
  const res = await fetch(`/motorLigar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ posicao: posicao })
  });
  let data = await res.text();
  console.log(data);
  */
}

// --------------------- Senha ---------------------
// Busca a senha cadastrada no servidor e guarda em senhacorreta
async function verSenha() {
  const res = await fetch("/verSenha", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  let data = await res.json();
  senhacorreta.push(data.senha);
}
verSenha();

// Ao carregar, esconde o menu (espera pela senha)
document.getElementById("menu").classList.add("hidden");

// Adiciona dígito na tentativa de senha e marca o botão pressionado
function add(num) {
  senhadigitada.push(num);
  const botoes = document.querySelectorAll("#senha button");
  botoes.forEach((btn) => {
    if (btn.innerText == num.toString()) {
      btn.classList.add("pressionado");
    }
  });
}

// Verifica se a senha digitada corresponde à senha carregada
function verificar() {
  let senhadigitadajoin = senhadigitada.join("");
  let senhacorretajoin = senhacorreta.join("");
  const correta = senhadigitadajoin === senhacorretajoin;
  console.log(senhacorretajoin, senhadigitadajoin);
  if (correta) {
    // senha correta: limpa e mostra menu
    senhadigitada = [];
    document.getElementById("senha").classList.add("hidden");
    document.getElementById("cancelar").classList.add("hidden");
    document.getElementById("titulo-senha").classList.add("hidden");
    document.getElementById("menu").classList.remove("hidden");
    document.getElementById("voltar").classList.remove("hidden");
  } else {
    // senha incorreta: limpa tentativa, tira classes de pressionado e oculta menu
    senhadigitada = [];
    document.getElementById("menu").classList.add("hidden");
    document.getElementById("voltar").classList.add("hidden");
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
  }
}

// Mostra sugestões (placeholder para implementar)
function mostrarSugestoes(inputElement) {
  inputElement.focus();
}

// Adiciona dígito para construção de nova senha
function addnova(num) {
  novasenha.push(num);
  const botoes = document.querySelectorAll("#senha button");
  botoes.forEach((btn) => {
    if (btn.innerText == num.toString()) {
      btn.classList.add("pressionado");
    }
  });
}

// Abre tela de alteração de senha no menu
function alterarSenhaMenu() {
  contadorFunçãoVoltar = 0; // reseta contador ao entrar nessa tela
  document
    .querySelectorAll("#senha")
    .forEach((btn) => btn.classList.remove("hidden"));
  document
    .querySelectorAll("#botoes")
    .forEach((btn) => btn.classList.add("hidden"));
  document.getElementById("titulo-senha").classList.remove("hidden");

  // Valida tamanho da nova senha (ex.: mínimo 4, máximo 6)
  if (novasenha.length > 6) {
    novasenha = [];
    let msg = document.getElementById("msg");
    msg.innerHTML = "Muitos Números (Máximo 6 números), senha não cadastrada";
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
    document.getElementById("voltar").classList.add("hidden");
  } else if (novasenha.length <= 6 && novasenha.length >= 4) {
    alterarSenha(); // envia nova senha para backend
    let msg = document.getElementById("msg");
    setTimeout(() => {
      window.location.href = "pagina_inicial.html";
    }, 2000);
    document
      .querySelectorAll("#senha button")
      .forEach((btn) => btn.classList.remove("pressionado"));
  }
}

// Envia nova senha ao servidor (POST)
async function alterarSenha() {
  let senhanova = novasenha.join("");
  fetch("/alterarSenha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ senhanova }),
  });
}

// Remove tentativa de senha atual (reset visual)
function remover() {
  senhadigitada = [];
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}

// Remove tentativa de nova senha durante cadastro de senha
function removernova() {
  novasenha = [];
  document.getElementById("voltar").classList.add("hidden");
  document
    .querySelectorAll("#senha button")
    .forEach((btn) => btn.classList.remove("pressionado"));
}

// --------------------- Navegação / Redirecionamento ---------------------
// Redireciona para páginas internas (chamada a partir do menu)
function Redirecionador(direcao) {
  switch (direcao) {
    case "Programar":
      window.location.href = "/HTML/programar.html";
      document.getElementById("teclado").classList.add("hidden");
      break;
    case "VerHorarios":
      window.location.href = "/HTML/verhorarios.html";
      verCadastro(); // atualiza lista ao abrir
      break;
    case "Configurar":
      window.location.href = "/HTML/configurar.html";
      break;
    case "Cancelar":
      window.location.href = "/HTML/pagina_inicial.html";
      break;
    case "Menu":
      window.location.href = "/HTML/menu.html";
      break;
  }
}

// --------------------- Programação de remédio (UI) ---------------------
// Seleciona dia e mostra inputs para preencher dados do remédio.
// Também reseta contadorFunçãoVoltar para evitar voltar acidentalmente.
function addDia(dia) {
  diaescolhido = dia;
  contadorFunçãoVoltar = 0; // Reseta o contador ao escolher um dia
  document
    .querySelectorAll("#botoes")
    .forEach((btn) => btn.classList.add("hidden"));
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.remove("hidden"));
  document.getElementById("teclado").classList.add("hidden");
}

// --------------------- Funções voltar (com reset do contador) ---------------------
// voltarProgramar: fecha inputs de programação e volta para lista de botões.
// Se já estiver na lista, incrementa contador e volta no histórico (1 clique).
function voltarProgramar() {
  // verifica se algum grupo de inputs está visível (usado para edição/programação)
  const inputsVisiveis = [...document.querySelectorAll(".inputs")].some(
    (el) => !el.classList.contains("hidden")
  );

  // limpa mensagens e valores dos inputs
  document.getElementById("msg").innerHTML = "";
  document.querySelectorAll(".inputs input").forEach((el) => (el.value = ""));

  if (inputsVisiveis) {
    // Se inputs visíveis: apenas esconda-os e mostre os botões; resete contador (não sai da página)
    document
      .querySelectorAll(".inputs")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll("#botoes")
      .forEach((el) => el.classList.remove("hidden"));

    contadorFunçãoVoltar = 0; // reset do contador ao fechar edição/programação
    return; // encerra função sem navegar
  }

  // Se não havia inputs abertos: incrementa e navega para trás
  contadorFunçãoVoltar++;
  if (contadorFunçãoVoltar >= 1) {
    window.history.back();
    contadorFunçãoVoltar = 0;
  }
}

// voltarConfigurar: similar para tela de configuração (reseta contador ao fechar)
function voltarConfigurar() {
  const senha = [...document.querySelectorAll("#senha")].some(
    (el) => !el.classList.contains("hidden")
  );

  if (senha) {
    document
      .querySelectorAll("#senha")
      .forEach((el) => el.classList.add("hidden"));
    document.getElementById("titulo-senha").classList.add("hidden");
    document
      .querySelectorAll("#botoes")
      .forEach((el) => el.classList.remove("hidden"));
    contadorFunçãoVoltar = 0; // reset ao fechar tela de senha
    return;
  }
  contadorFunçãoVoltar++;
  if (contadorFunçãoVoltar >= 1) {
    window.history.back();
    contadorFunçãoVoltar = 0;
  }
}

// voltarVerHorarios: fecha tela de edição e volta à lista de remédios; reset do contador quando fecha edição
function voltarVerHorarios() {
  // Se estamos editando (inputs visíveis)
  const inputsVisiveis = [...document.querySelectorAll(".inputs")].some(
    (el) => !el.classList.contains("hidden")
  );

  if (inputsVisiveis) {
    // Fecha edição e mostra lista de remédios
    document
      .querySelectorAll(".inputs")
      .forEach((el) => el.classList.add("hidden"));
    document
      .querySelectorAll(".remediosCadastrados")
      .forEach((el) => el.classList.remove("hidden"));
    contadorFunçãoVoltar = 0; // reset ao fechar edição
    return;
  }

  // Se já estamos na lista: volta no histórico (1 clique)
  contadorFunçãoVoltar++;
  if (contadorFunçãoVoltar >= 1) {
    window.history.back();
    contadorFunçãoVoltar = 0;
  }
}

// --------------------- Programar remédio (envio) ---------------------
function programar() {
  const agora = new Date();
  const horaNow = agora.getHours();
  const minutoNow = agora.getMinutes();

  // Lê os valores dos 4 possíveis blocos de inputs
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

  // Preenche os inputs com hora atual + 1 minuto como feedback visual
  document.getElementById("hora1").value = `${horaNow}:${minutoNow + 1}`;
  document.getElementById("hora2").value = `${horaNow}:${minutoNow + 1}`;
  document.getElementById("hora3").value = `${horaNow}:${minutoNow + 1}`;
  document.getElementById("hora4").value = `${horaNow}:${minutoNow + 1}`;

  // Envia o primeiro bloco válido encontrado (lógica original mantida)
  if (nome != "" && !isNaN(slot) && horaMinuto != "") {
    EnviarProgramar(nome, hora, minuto, slot);
    document.getElementById("nome1").value = "";
    document.getElementById("slot1").value = "";
    document.getElementById("hora1").value = "";
  } else if (nome2 != "" && !isNaN(slot2) && horaMinuto2 != "") {
    EnviarProgramar(nome2, hora2, minuto2, slot2);
    document.getElementById("nome2").value = "";
    document.getElementById("slot2").value = "";
    document.getElementById("hora2").value = "";
  } else if (nome3 != "" && !isNaN(slot3) && horaMinuto3 != "") {
    EnviarProgramar(nome3, hora3, minuto3, slot3);
    document.getElementById("nome3").value = "";
    document.getElementById("slot3").value = "";
    document.getElementById("hora3").value = "";
  } else if (nome4 != "" && !isNaN(slot4) && horaMinuto4 != "") {
    EnviarProgramar(nome4, hora4, minuto4, slot4);
    document.getElementById("nome4").value = "";
    document.getElementById("slot4").value = "";
    document.getElementById("hora4").value = "";
  }
}

// Envia os dados ao backend e mostra mensagem de retorno
async function EnviarProgramar(nome, hora, minuto, slot) {
  const res = await fetch("/addRemedio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nome: nome,
      dia: diaescolhido,
      hora: hora,
      minuto: minuto,
      slot: slot,
    }),
  });
  let data = await res.text();
  document.getElementById("msg").innerHTML = data;
  setTimeout(() => {
    document.getElementById("msg").innerHTML = "";
  }, 10000);
}

// --------------------- Listagem, remover e edição ---------------------
// Busca todos os remédios e renderiza na tela
async function verCadastro() {
  contadorFunçãoVoltar = 0; // reset ao abrir a lista
  const res = await fetch("/remediosCadastrados");
  const remedios = await res.json();
  const container = document.querySelector(".remediosCadastrados");
  container.innerHTML = ""; // limpa conteiner antes de renderizar

  // cria um card para cada remédio retornado
  remedios.forEach((remedio) => {
    const div = document.createElement("div");
    div.className = "remedioCadastrado";
    div.innerHTML = `
      <div id="remedioInfo">
        <p>
          Id: ${remedio.id} | Nome: ${remedio.nome} | Dia: ${remedio.dia} | Hora: ${remedio.hora.toString().padStart(2, "0")}:${remedio.minuto.toString().padStart(2, "0")} | Slot: ${remedio.slot}
        </p>
      </div>
      <button class="botoes" onclick="abrirEditar(${remedio.id})">
        <img src="/images/editar.png" alt="Editar" />
      </button>
      <button class="botoes" onclick="removerRemedio(${remedio.id})">
        <img src="/images/remover.png" alt="Remover" />
      </button>
    `;
    container.appendChild(div);
  });

  contadorEditar = 0; // zera contador de edição ao listar
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.add("hidden")); // esconde inputs de edição
}

// Remove remédio enviando id ao backend e atualiza a lista
async function removerRemedio(remedio) {
  const res = await fetch("/removerRemedio", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ remedio }),
  });
  verCadastro(); // atualiza lista após remoção
}

// Abre a UI de edição preenchendo os inputs com os dados do remédio selecionado
async function abrirEditar(remedioid) {
  contadorFunçãoVoltar = 0; // reseta contador ao entrar em editar
  console.log(contadorFunçãoVoltar);

  // mostra inputs de edição e esconde a lista de remédios
  document
    .querySelectorAll(".inputs")
    .forEach((btn) => btn.classList.remove("hidden"));
  document
    .querySelectorAll(".remediosCadastrados")
    .forEach((card) => card.classList.add("hidden"));

  contadorEditar++; // conta quantas vezes entrou em modo editar
  // busca os dados do remédio pelo id (GET)
  let resCadastro = await fetch(`/remedioCadastrado?id=${remedioid}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const remedios = await resCadastro.json();

  // preenche inputs de edição (IDs no HTML devem coincidir com esses)
  document.getElementById("nome-editar").value = remedios.nome;
  document.getElementById("slot-editar").value = remedios.slot;
  document.getElementById("dia-editar").value = remedios.dia;
  document.getElementById("hora-editar").value =
    remedios.hora.toString().padStart(2, "0") +
    ":" +
    remedios.minuto.toString().padStart(2, "0");

  id_remedio = remedioid; // guarda id para usar na edição final
}

// Envia edição ao backend — função é chamada quando o usuário confirma salvar.
// A lógica aqui só envia quando contadorEditar == 2 (fluxo original mantido).
async function editar() {
  contadorEditar++;
  let nomeEditado = document.getElementById("nome-editar").value;
  let slotEditado = parseInt(document.getElementById("slot-editar").value);
  let horaMinuto = document.getElementById("hora-editar").value;
  let dia = document.getElementById("dia-editar").value;
  let [hora, minuto] = horaMinuto.split(":").map(Number);
  console.log(contadorEditar);

  // O comportamento original exige 2 cliques para confirmar a edição.
  // Se preferir enviar em 1 clique, altere a condição para contadorEditar == 1 ou remova o contador.
  if (contadorEditar == 2) {
    const res = await fetch("/editarRemedio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id_remedio,
        nome: nomeEditado,
        hora: hora,
        minuto: minuto,
        slot: slotEditado,
        dia,
      }),
    });

    // após editar, limpa campos, fecha edição e atualiza lista
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
    console.log(contadorEditar);
    id_remedio = null;
    verCadastro(); // atualiza lista com alterações
  }
}
