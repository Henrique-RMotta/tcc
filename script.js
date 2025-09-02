
let horas = [];
    setInterval (() => {
    const agora = new Date;
    let horarioCadastrado = horas.find((cadastro) => 
        cadastro.dia === agora.getDate() &&
        cadastro.hora === agora.getHours() &&
        cadastro.minuto === agora.getMinutes()
    );
    let horariochego = false;
    if (horarioCadastrado) {
        horariochego = true;
        console.log("Sim está na hora !");
        if(horariochego){
        ligaled();
        setTimeout(() => {
        horariochego = false;
        }, 60*500);
        }
    } else {
        console.log("já passou, ou ainda não está na hora");
        desligarled();
    }
    console.log(horarioCadastrado);
    console.log(horas);
    console.log("Hoje é: " + agora.getDate());
    console.log("São: " + agora.getHours() + ":" + agora.getMinutes());
    },60*600)
function mandar() {
let dia = parseInt(document.getElementById("dia").value);
let hora = parseInt(document.getElementById("hora").value);
let minuto = parseInt(document.getElementById("minuto").value);
    if(isNaN(dia) || isNaN(hora) || isNaN(minuto)){
        console.log("preencha todos os campos");
        } else {
        console.log("cadastrado");
        horas.push({dia,hora,minuto});
        document.getElementById("dia").value = "";
        document.getElementById("hora").value = "";
        document.getElementById("minuto").value = "";
    }
}
async function ligaled() {
    let p = document.getElementById("ola");
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



