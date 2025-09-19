let horas = [];
    setInterval(() => {
        const agora = new Date();
        let horarioCadastrado = horas.find((cadastro) => 
            cadastro.dia === agora.getDate() &&
            cadastro.hora === agora.getHours() &&
            cadastro.minuto === agora.getMinutes()
        );
        if (horarioCadastrado) {
            ligaled();
        } else {
            console.log("já passou, ou ainda não está na hora");
            desligarled();
        }
        let p = document.getElementById("ola2");
        p.innerHTML = `Find:${horarioCadastrado}--
        Horas Cadastradas:${horas}--
        Hoje é: ${agora.getDate()}--
        São:${agora.getHours()}:${agora.getMinutes()}`
        console.log(horarioCadastrado);
        console.log(horas);
    }, 60 * 600);

    setInterval(() => {
        const agora = new Date;
       let horaStr = agora.getHours().toString().padStart(2, '0');
        let minStr = agora.getMinutes().toString().padStart(2, '0');
        document.getElementById("hora1").innerHTML = `<span>${horaStr[0]}</span>`;
        document.getElementById("hora2").innerHTML = `<span>${horaStr[1]}</span>`;
        document.getElementById("min1").innerHTML = `<span>${minStr[0]}</span>`;
        document.getElementById("min2").innerHTML = `<span>${minStr[1]}</span>`;
    }, 1000);
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
        document.getElementById("voltar").classList.remove("hidden");
    } else {
        a.innerHTML = "Senha incoreta";
        senhadigitada = [];
        document.getElementById("menu").classList.add("hidden");
        document.getElementById("voltar").classList.add("hidden");
        document.querySelectorAll("#senha button").forEach(btn => btn.classList.remove("pressionado"));
    }        
}

function remover(){
    senhadigitada = [];
    document.getElementById("menu").classList.add("hidden")
    document.getElementById("voltar").classList.add("hidden")
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

function programar2(dia) {
    document.querySelectorAll("#botoes").forEach(btn => btn.classList.add("hidden"));
    document.querySelectorAll("#inputs").forEach(btn => btn.classList.remove("hidden"));
    let diaescolhido = [];
    diaescolhido.push(dia);
}