let clase = "";
let mascara = "";
let ip1 = 0;
let ip2 = 0;
let ip3 = 0;
let ip4 = 0;

const oct1 = document.getElementById("oct1");
const oct2 = document.getElementById("oct2");
const oct3 = document.getElementById("oct3");
const oct4 = document.getElementById("oct4");

const desde = document.getElementById("desde");
const hasta = document.getElementById("hasta");
const direccionIP = document.getElementById("direccionIP");
const claseIP = document.getElementById("claseIP");
const mascaraSubred = document.getElementById("mascaraSubred");
const saltoRed = document.getElementById("saltoRed");
const cantidadSubredes = document.getElementById("cantidadSubredes");
const tablaSubredes = document.getElementById("tablaSubredes");
const mensaje = document.getElementById("mensaje");

document.getElementById("btnClaseA").onclick = function () {
    seleccionarClase("A");
};

document.getElementById("btnClaseB").onclick = function () {
    seleccionarClase("B");
};

document.getElementById("btnClaseC").onclick = function () {
    seleccionarClase("C");
};

document.getElementById("btnVerificar").onclick = verificarIP;
document.getElementById("btnGenerar").onclick = generarSubredes;
document.getElementById("btnLimpiar").onclick = limpiar;

document.getElementById("btnSalir").onclick = function () {
    window.close();

    mostrarMensaje(
        "SALIR",
        "Si el navegador no permite cerrar la ventana, ciérrala manualmente.",
        "advertencia"
    );
};

function seleccionarClase(tipo) {
    clase = tipo;
    claseIP.value = tipo;

    if (tipo === "A") {
        desde.value = "0.0.0.0";
        hasta.value = "127.255.255.255";
        mascara = "255.0.0.0";
    }

    if (tipo === "B") {
        desde.value = "128.0.0.0";
        hasta.value = "191.255.255.255";
        mascara = "255.255.0.0";
    }

    if (tipo === "C") {
        desde.value = "192.0.0.0";
        hasta.value = "223.255.255.255";
        mascara = "255.255.255.0";
    }

    mascaraSubred.value = mascara;

    activarIP(true);

    document.getElementById("btnVerificar").disabled = false;
    document.getElementById("btnGenerar").disabled = true;
    document.getElementById("btnLimpiar").disabled = true;

    cantidadSubredes.disabled = true;

    limpiarCamposIP();
    limpiarResultados();
    marcarClaseActiva(tipo);

    tablaSubredes.innerHTML = `
        <tr>
            <td colspan="6" class="sin-datos">Ingrese una IP para generar subredes.</td>
        </tr>
    `;

    oct1.focus();

    mostrarMensaje(
        "CLASE SELECCIONADA",
        "Clase " + tipo + " activada correctamente. Puede cambiarla cuando quiera.",
        "correcto"
    );
}

function verificarIP() {
    if (clase === "") {
        mostrarMensaje("CLASE REQUERIDA", "Primero seleccione una clase de IP.", "advertencia");
        return;
    }

    let errores = [];
    let primerCampoMalo = null;

    ip1 = Number(oct1.value);
    ip2 = Number(oct2.value);
    ip3 = Number(oct3.value);
    ip4 = Number(oct4.value);

    if (oct1.value === "" || ip1 < 0 || ip1 > 255) {
        errores.push("Octeto 1");
        oct1.value = "";
        if (primerCampoMalo === null) primerCampoMalo = oct1;
    }

    if (oct2.value === "" || ip2 < 0 || ip2 > 255) {
        errores.push("Octeto 2");
        oct2.value = "";
        if (primerCampoMalo === null) primerCampoMalo = oct2;
    }

    if (oct3.value === "" || ip3 < 0 || ip3 > 255) {
        errores.push("Octeto 3");
        oct3.value = "";
        if (primerCampoMalo === null) primerCampoMalo = oct3;
    }

    if (oct4.value === "" || ip4 < 0 || ip4 > 255) {
        errores.push("Octeto 4");
        oct4.value = "";
        if (primerCampoMalo === null) primerCampoMalo = oct4;
    }

    if (errores.length > 0) {
        mostrarMensaje(
            "IP INCORRECTA",
            "Se limpiaron los campos incorrectos: " + errores.join(", ") + ".",
            "error",
            primerCampoMalo
        );
        return;
    }

    if (ip1 === 0) {
        oct1.value = "";
        mostrarMensaje("IP NO FUNCIONAL", "El primer octeto no puede ser 0.", "error", oct1);
        return;
    }

    if (ip1 === 127) {
        oct1.value = "";
        mostrarMensaje("IP NO FUNCIONAL", "El rango 127 es reservado para loopback.", "error", oct1);
        return;
    }

    if (ip1 >= 224) {
        oct1.value = "";
        mostrarMensaje(
            "IP NO FUNCIONAL",
            "Las IP desde 224 en adelante no son Clase A, B o C normales.",
            "error",
            oct1
        );
        return;
    }

    if (clase === "A" && (ip1 < 1 || ip1 > 127)) {
        oct1.value = "";
        mostrarMensaje(
            "CLASE INCORRECTA",
            "Para Clase A el primer octeto debe estar entre 1 y 126.",
            "error",
            oct1
        );
        return;
    }

    if (clase === "B" && (ip1 < 128 || ip1 > 191)) {
        oct1.value = "";
        mostrarMensaje(
            "CLASE INCORRECTA",
            "Para Clase B el primer octeto debe estar entre 128 y 191.",
            "error",
            oct1
        );
        return;
    }

    if (clase === "C" && (ip1 < 192 || ip1 > 223)) {
        oct1.value = "";
        mostrarMensaje(
            "CLASE INCORRECTA",
            "Para Clase C el primer octeto debe estar entre 192 y 223.",
            "error",
            oct1
        );
        return;
    }

    let errorFuncional = validarIPFuncional();

    if (errorFuncional !== "") {
        mostrarMensaje("IP NO FUNCIONAL", errorFuncional, "error", oct4);
        return;
    }

    direccionIP.value = ip1 + "." + ip2 + "." + ip3 + "." + ip4;
    mascaraSubred.value = mascara;

    activarIP(false);

    document.getElementById("btnVerificar").disabled = true;
    document.getElementById("btnGenerar").disabled = false;
    document.getElementById("btnLimpiar").disabled = false;

    cantidadSubredes.disabled = false;

    mostrarMensaje(
        "IP VERIFICADA",
        "La dirección IP es válida y funcional. Ahora puede generar subredes.",
        "correcto",
        cantidadSubredes
    );
}

function validarIPFuncional() {
    if (clase === "A") {
        if (ip2 === 0 && ip3 === 0 && ip4 === 0) {
            oct2.value = "";
            oct3.value = "";
            oct4.value = "";
            return "No puede usar dirección de red. Se limpiaron los octetos 2, 3 y 4.";
        }

        if (ip2 === 255 && ip3 === 255 && ip4 === 255) {
            oct2.value = "";
            oct3.value = "";
            oct4.value = "";
            return "No puede usar dirección broadcast. Se limpiaron los octetos 2, 3 y 4.";
        }
    }

    if (clase === "B") {
        if (ip3 === 0 && ip4 === 0) {
            oct3.value = "";
            oct4.value = "";
            return "No puede usar dirección de red. Se limpiaron los octetos 3 y 4.";
        }

        if (ip3 === 255 && ip4 === 255) {
            oct3.value = "";
            oct4.value = "";
            return "No puede usar dirección broadcast. Se limpiaron los octetos 3 y 4.";
        }
    }

    if (clase === "C") {
        if (ip4 === 0) {
            oct4.value = "";
            return "No puede usar dirección de red. Se limpió el octeto 4.";
        }

        if (ip4 === 255) {
            oct4.value = "";
            return "No puede usar dirección broadcast. Se limpió el octeto 4.";
        }
    }

    return "";
}

function generarSubredes() {
    let subredes = Number(cantidadSubredes.value);

    if (cantidadSubredes.value === "" || subredes <= 0) {
        cantidadSubredes.value = "";
        mostrarMensaje(
            "CANTIDAD INCORRECTA",
            "Ingrese una cantidad válida de subredes.",
            "advertencia",
            cantidadSubredes
        );
        return;
    }

    let bits = 0;

    while (Math.pow(2, bits) < subredes) {
        bits++;
    }

    let valorMascara = 256 - Math.pow(2, 8 - bits);
    let salto = 256 - valorMascara;

    if (bits > 6 || salto < 4) {
        cantidadSubredes.value = "";
        mostrarMensaje(
            "CANTIDAD MUY ALTA",
            "Use una cantidad menor para que existan IP disponibles.",
            "error",
            cantidadSubredes
        );
        return;
    }

    if (clase === "A") {
        mascara = "255." + valorMascara + ".0.0";
    }

    if (clase === "B") {
        mascara = "255.255." + valorMascara + ".0";
    }

    if (clase === "C") {
        mascara = "255.255.255." + valorMascara;
    }

    mascaraSubred.value = mascara;
    saltoRed.value = salto;

    tablaSubredes.innerHTML = "";

    for (let i = 1; i <= subredes; i++) {
        let red = (i - 1) * salto;
        let primera = red + 1;
        let broadcast = red + salto - 1;
        let ultima = broadcast - 1;

        let direccionRed = "";
        let primeraIP = "";
        let ultimaIP = "";
        let broadcastIP = "";

        if (clase === "A") {
            direccionRed = ip1 + "." + red + ".0.0";
            primeraIP = ip1 + "." + primera + ".0.1";
            ultimaIP = ip1 + "." + ultima + ".255.254";
            broadcastIP = ip1 + "." + broadcast + ".255.255";
        }

        if (clase === "B") {
            direccionRed = ip1 + "." + ip2 + "." + red + ".0";
            primeraIP = ip1 + "." + ip2 + "." + primera + ".1";
            ultimaIP = ip1 + "." + ip2 + "." + ultima + ".254";
            broadcastIP = ip1 + "." + ip2 + "." + broadcast + ".255";
        }

        if (clase === "C") {
            direccionRed = ip1 + "." + ip2 + "." + ip3 + "." + red;
            primeraIP = ip1 + "." + ip2 + "." + ip3 + "." + primera;
            ultimaIP = ip1 + "." + ip2 + "." + ip3 + "." + ultima;
            broadcastIP = ip1 + "." + ip2 + "." + ip3 + "." + broadcast;
        }

        tablaSubredes.innerHTML += `
            <tr>
                <td>${i}</td>
                <td>${direccionRed}</td>
                <td>${mascara}</td>
                <td>${primeraIP}</td>
                <td>${ultimaIP}</td>
                <td>${broadcastIP}</td>
            </tr>
        `;
    }

    mostrarMensaje(
        "SUBREDES GENERADAS",
        "La tabla fue creada correctamente.",
        "correcto"
    );
}

function limpiar() {
    limpiarCamposIP();
    limpiarResultados();

    tablaSubredes.innerHTML = `
        <tr>
            <td colspan="6" class="sin-datos">Ingrese una nueva IP para generar subredes.</td>
        </tr>
    `;

    activarIP(true);

    cantidadSubredes.disabled = true;

    document.getElementById("btnVerificar").disabled = false;
    document.getElementById("btnGenerar").disabled = true;
    document.getElementById("btnLimpiar").disabled = true;

    mostrarMensaje("DATOS LIMPIADOS", "Puede ingresar una nueva IP.", "correcto", oct1);
}

function limpiarCamposIP() {
    oct1.value = "";
    oct2.value = "";
    oct3.value = "";
    oct4.value = "";
}

function limpiarResultados() {
    direccionIP.value = "";
    saltoRed.value = "";
    cantidadSubredes.value = "";

    if (clase !== "") {
        mascaraSubred.value = mascara;
    } else {
        mascaraSubred.value = "";
    }
}

function activarIP(estado) {
    oct1.disabled = !estado;
    oct2.disabled = !estado;
    oct3.disabled = !estado;
    oct4.disabled = !estado;
}

function marcarClaseActiva(tipo) {
    document.getElementById("btnClaseA").classList.remove("clase-activa");
    document.getElementById("btnClaseB").classList.remove("clase-activa");
    document.getElementById("btnClaseC").classList.remove("clase-activa");

    if (tipo === "A") {
        document.getElementById("btnClaseA").classList.add("clase-activa");
    }

    if (tipo === "B") {
        document.getElementById("btnClaseB").classList.add("clase-activa");
    }

    if (tipo === "C") {
        document.getElementById("btnClaseC").classList.add("clase-activa");
    }
}

function mostrarMensaje(titulo, texto, tipo, campo) {
    mensaje.className = "mensaje " + tipo;

    mensaje.innerHTML = `
        <div class="mensaje-caja">
            <h3>${titulo}</h3>
            <p>${texto}</p>
            <button id="btnAceptarMensaje">ACEPTAR</button>
        </div>
    `;

    document.getElementById("btnAceptarMensaje").onclick = function () {
        mensaje.className = "mensaje oculto";

        if (campo) {
            campo.disabled = false;
            campo.focus();
            campo.select();
        }
    };
}

function soloNumeros(input) {
    input.oninput = function () {
        input.value = input.value.replace(/[^0-9]/g, "");

        if (input !== cantidadSubredes && input.value.length > 3) {
            input.value = input.value.slice(0, 3);
        }
    };
}

soloNumeros(oct1);
soloNumeros(oct2);
soloNumeros(oct3);
soloNumeros(oct4);
soloNumeros(cantidadSubredes);