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

function marcar() {
    const agora = new Date; 
    let p = document.getElementById("ola2");
    let dia = agora.getDate();
    let hora = agora.getHours();
    let minuto = agora.getMinutes();
    horas.push({dia,hora,minuto})
    p.innerHTML = "Cadastrado"
}
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


function menu() {
    setTimeout(() => {
            window.location.href = "menu.html";
        }, 1000);
}
