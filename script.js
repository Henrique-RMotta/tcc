let p = document.getElementById("ola");

async function ligaled () {
    const res = await fetch(`/ledligar`, {method: 'POST'});
    let data = await res.text();
    p.innerHTML = data;

}

async function desligarled() {
    let p = document.getElementById("ola");
    const res = await fetch(`/leddesligar`, {method: 'POST'});
    let data = await res.text();
    p.innerHTML = data;
}

function menu() {
    setTimeout(() => {
            window.location.href = "menu.html";
        }, 1000);
}

let senhadigitada = [];
const senhacorreta = [1,2,3,4];
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
    a = document.getElementById("a");
    const correta = senhadigitada.every((val, idx) => val === senhacorreta[idx]);
    if (correta && senhadigitada.length === senhacorreta.length) {
        a.innerHTML = "liberado";
        setTimeout(() => {
            a.innerHTML = "";
        }, 5000);
        
        senhadigitada = [];
        document.getElementById("senha").classList.add("hidden");
        document.getElementById("cancelar").classList.add("hidden");
        document.getElementById("titulo-senha").classList.add("hidden");
        document.getElementById("menu").classList.remove("hidden");
    } else {
        a.innerHTML = "Senha incoreta";
        senhadigitada = [];
        document.getElementById("menu").classList.add("hidden");
        document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
    }        
}

function remover(){
    senhadigitada = [];
    document.getElementById("menu").classList.add("hidden")
    document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
}

function programar() {
setTimeout(() => {
window.location.href = "programar.html";
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