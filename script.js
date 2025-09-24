let novasenha = [];
setInterval(() => {
        const agora = new Date();
       let horaStr = agora.getHours().toString().padStart(2, '0');
        let minStr = agora.getMinutes().toString().padStart(2, '0');
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
    const res = await fetch ("/verSenha",{
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    let data = await res.json();
    senhacorreta.push(data.senha);
}
verSenha();
const senhacorreta = [];
let senhadigitada = [];

document.getElementById("menu").classList.add("hidden")
function add(num){
    senhadigitada.push(num);
    const botoes = document.querySelectorAll("#senha button");
    botoes.forEach(btn => {
    if (btn.innerText == num.toString()) {
                btn.classList.add("pressionado");
            }
        });
}

function verificar() {
    let senhadigitadajoin = senhadigitada.join("");
    let senhacorretajoin = senhacorreta.join("");
    const correta = senhadigitadajoin === senhacorretajoin;
     console.log(senhacorretajoin,senhadigitadajoin);
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
        document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
    }        
}

function addnova(num) {
    novasenha.push(num);
    const botoes = document.querySelectorAll("#senha button");
    botoes.forEach(btn => {
    if (btn.innerText == num.toString()) {
                btn.classList.add("pressionado");
            }
        });
}
function alterarSenhaMenu() {
    document.querySelectorAll("#senha").forEach(btn => btn.classList.remove("hidden"));
    document.querySelectorAll("#botoes").forEach(btn => btn.classList.add("hidden"));
    document.getElementById("titulo-senha").classList.remove("hidden");
    if (novasenha.length > 6) {
        novasenha= [];
        let msg = document.getElementById("msg");
        msg.innerHTML = "Muitos Números (Máximo 6 números), senha não cadastrada";
        document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
        document.getElementById("voltar").classList.add("hidden")
    } else  if (novasenha.length <= 6 && novasenha.length >=4){
        alterarSenha();
        let msg = document.getElementById("msg");
        msg.innerHTML = "cadastrada";
        setTimeout(() => {
        window.location.href = "página_inicial.html";
        }, 5000);
        document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
    }
}
async function alterarSenha() {
    let senhanova = novasenha.join("")
    fetch("/alterarSenha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({senhanova})
});
}
function remover(){
    senhadigitada = [];
    document.getElementById("menu").classList.add("hidden")
    document.getElementById("voltar").classList.add("hidden")
    document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
}
function removernova(){
    novasenha = [];
    document.getElementById("voltar").classList.add("hidden")
    document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
}
function programar() {
setTimeout(() => {
window.location.href = "programar.html";
document.getElementById("teclado").classList.add("hidden");
}, 1);
}

function verhorarios () {
setTimeout(() => {
window.location.href = "verhorarios.html";
}, 1);
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
async function programar2(dia) {
    document.querySelectorAll("#botoes").forEach(btn => btn.classList.add("hidden"));
    document.querySelectorAll(".inputs").forEach(btn => btn.classList.remove("hidden"));
    document.getElementById("teclado").classList.add("hidden");
    const nome = document.getElementById("nome").value;
    const slot = document.getElementById("slot").value;
    const horaMinuto = document.getElementById("hora").value; 
    const [hora, minuto] = horaMinuto.split(":").map(Number);
    await fetch ("/addRemedio",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({nome,dia,hora,minuto,slot})
    });
     
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
document.getElementById("nome").addEventListener("focus", () => setInput("nome"));
document.getElementById("hora").addEventListener("focus", () => setInput("hora"));

// Teclado virtual
document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        if (!inputAtivo) return;
        if (key.classList.contains("space")) {
            inputAtivo.value += " ";
        } else {
            inputAtivo.value += key.textContent;
        }
    });
});



