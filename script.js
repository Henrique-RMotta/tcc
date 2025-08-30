let p = document.getElementById("ola");
let horas = [];
    setInterval (() => {
    const agora = new Date;
    let horarioCadastrado = horas.find((cadastro) => 
        cadastro.dia === agora.getDay() &&
        cadastro.hora === agora.getHours() &&
        cadastro.minuto === agora.getMinutes()
    );
    if (horarioCadastrado) {
        console.log("Sim está na hora !");
    } else {
        console.log("já passou, ou ainda não está na hora");
    }
    console.log(horarioCadastrado);
    console.log("Hoje é: " + agora.getDate());
    console.log("São: " + agora.getHours() + ":" + agora.getMinutes());
    },60*1000);
function mandar() {
let dia = parseInt(document.getElementById("dia").value);
let hora = parseInt(document.getElementById("hora").value);
let minuto = parseInt(document.getElementById("minuto").value);
    if(dia != undefined && hora != undefined && minuto != undefined){
        console.log("cadastrado");
        horas.push({dia,hora,minuto});
        document.getElementById("dia").value = "";
        document.getElementById("hora").value = "";
        document.getElementById("minuto").value = "";
        } else {
        console.log("preencha todos os campos");
    }
}
async function ligaled () {
    const res = await fetch(`/ledligar`, {method: 'POST'});
    let data = await res.text();
    p.innerHTML = data
}

async function desligarled () {
    const res = await fetch(`/leddesligar`, {method: 'POST'});
    let data = await res.text();
    p.innerHTML = data;
}



