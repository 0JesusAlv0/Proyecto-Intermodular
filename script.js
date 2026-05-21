let clase = "";
let mascara = "";
let ip1 = 0;
let ip2 = 0;
let ip3 = 0;
let ip4 = 0;
let prefijoBase = 0;
let prefijoNuevo = 0;

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

const btnClaseA = document.getElementById("btnClaseA");
const btnClaseB = document.getElementById("btnClaseB");
const btnClaseC = document.getElementById("btnClaseC");
const btnVerificar = document.getElementById("btnVerificar");
const btnGenerar = document.getElementById("btnGenerar");
const btnLimpiar = document.getElementById("btnLimpiar");
const btnSalir = document.getElementById("btnSalir");

btnClaseA.onclick = function () {
    seleccionarClase("A");
};

btnClaseB.onclick = function () {
    seleccionarClase("B");
};

btnClaseC.onclick = function () {
    seleccionarClase("C");
};

btnVerificar.onclick = verificarIP;
btnGenerar.onclick = generarSubredes;
btnLimpiar.onclick = limpiar;

btnSalir.onclick = function () {
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
        prefijoBase = 8;
    }

    if (tipo === "B") {
        desde.value = "128.0.0.0";
        hasta.value = "191.255.255.255";
        mascara = "255.255.0.0";
        prefijoBase = 16;
    }

    if (tipo === "C") {
        desde.value = "192.0.0.0";
        hasta.value = "223.255.255.255";
        mascara = "255.255.255.0";
        prefijoBase = 24;
    }

    mascaraSubred.value = mascara;
    saltoRed.value = "";

    activarIP(true);

    btnVerificar.disabled = false;
    btnGenerar.disabled = true;
    btnLimpiar.disabled = true;
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
        "Clase " + tipo + " activada correctamente. Rango permitido: " + desde.value + " hasta " + hasta.value + ".",
        "correcto"
    );
}

function verificarIP() {
    if (clase === "") {
        mostrarMensaje("CLASE REQUERIDA", "Primero seleccione una clase de IP.", "advertencia");
        return;
    }

    let datos = leerOctetos();

    if (datos === null) {
        return;
    }

    ip1 = datos[0];
    ip2 = datos[1];
    ip3 = datos[2];
    ip4 = datos[3];

    if (clase === "A" && (ip1 < 0 || ip1 > 127)) {
        oct1.value = "";
        mostrarMensaje(
            "CLASE INCORRECTA",
            "Para Clase A el primer octeto debe estar entre 0 y 127.",
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

    direccionIP.value = ip1 + "." + ip2 + "." + ip3 + "." + ip4;
    mascaraSubred.value = mascara;
    saltoRed.value = "Pendiente";

    activarIP(false);

    btnVerificar.disabled = true;
    btnGenerar.disabled = false;
    btnLimpiar.disabled = false;
    cantidadSubredes.disabled = false;

    mostrarMensaje(
        "IP VERIFICADA",
        "La IP pertenece correctamente a la Clase " + clase + ". Ahora puede generar subredes.",
        "correcto",
        cantidadSubredes
    );
}

function leerOctetos() {
    const campos = [oct1, oct2, oct3, oct4];
    const valores = [];

    for (let i = 0; i < campos.length; i++) {
        let valor = campos[i].value.trim();

        if (valor === "") {
            mostrarMensaje(
                "CAMPO VACÍO",
                "El octeto " + (i + 1) + " está vacío.",
                "error",
                campos[i]
            );
            return null;
        }

        if (!/^[0-9]{1,3}$/.test(valor)) {
            campos[i].value = "";
            mostrarMensaje(
                "DATO INCORRECTO",
                "El octeto " + (i + 1) + " solo acepta números de 1 a 3 dígitos.",
                "error",
                campos[i]
            );
            return null;
        }

        let numero = Number(valor);

        if (numero < 0 || numero > 255) {
            campos[i].value = "";
            mostrarMensaje(
                "RANGO INCORRECTO",
                "El octeto " + (i + 1) + " debe estar entre 0 y 255.",
                "error",
                campos[i]
            );
            return null;
        }

        valores.push(numero);
    }

    return valores;
}

function generarSubredes() {
    let subredes = Number(cantidadSubredes.value);

    if (cantidadSubredes.value.trim() === "" || !Number.isInteger(subredes) || subredes <= 0) {
        cantidadSubredes.value = "";
        mostrarMensaje(
            "CANTIDAD INCORRECTA",
            "Ingrese una cantidad válida de subredes.",
            "advertencia",
            cantidadSubredes
        );
        return;
    }

    if (subredes > 512) {
        cantidadSubredes.value = "";
        mostrarMensaje(
            "CANTIDAD MUY ALTA",
            "Para que la tabla no se vuelva pesada, genere máximo 512 subredes.",
            "advertencia",
            cantidadSubredes
        );
        return;
    }

    let bitsPrestados = 0;

    while (Math.pow(2, bitsPrestados) < subredes) {
        bitsPrestados++;
    }

    prefijoNuevo = prefijoBase + bitsPrestados;

    if (prefijoNuevo > 30) {
        cantidadSubredes.value = "";
        mostrarMensaje(
            "SIN HOSTS DISPONIBLES",
            "La cantidad de subredes es demasiado alta y dejaría redes sin IPs útiles.",
            "error",
            cantidadSubredes
        );
        return;
    }

    mascara = obtenerMascara(prefijoNuevo);
    mascaraSubred.value = mascara;

    let tamañoBloque = Math.pow(2, 32 - prefijoNuevo);
    let salto = obtenerSalto(prefijoNuevo);
    saltoRed.value = salto;

    let baseRed = obtenerRedBase();
    tablaSubredes.innerHTML = "";

    for (let i = 0; i < subredes; i++) {
        let redNumero = baseRed + i * tamañoBloque;
        let broadcastNumero = redNumero + tamañoBloque - 1;
        let primeraNumero = redNumero + 1;
        let ultimaNumero = broadcastNumero - 1;

        let direccionRed = numeroAIP(redNumero);
        let primeraIP = numeroAIP(primeraNumero);
        let ultimaIP = numeroAIP(ultimaNumero);
        let broadcastIP = numeroAIP(broadcastNumero);

        tablaSubredes.innerHTML += `
            <tr>
                <td>${i + 1}</td>
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
        "Se generaron " + subredes + " subredes correctamente con máscara " + mascara + ".",
        "correcto"
    );
}

function obtenerRedBase() {
    if (clase === "A") {
        return ipANumero(ip1, 0, 0, 0);
    }

    if (clase === "B") {
        return ipANumero(ip1, ip2, 0, 0);
    }

    if (clase === "C") {
        return ipANumero(ip1, ip2, ip3, 0);
    }

    return 0;
}

function ipANumero(a, b, c, d) {
    return (((a * 256) + b) * 256 + c) * 256 + d;
}

function numeroAIP(numero) {
    let a = Math.floor(numero / 16777216) % 256;
    let b = Math.floor(numero / 65536) % 256;
    let c = Math.floor(numero / 256) % 256;
    let d = numero % 256;

    return a + "." + b + "." + c + "." + d;
}

function obtenerMascara(prefijo) {
    let octetosMascara = [];
    let bits = prefijo;

    for (let i = 0; i < 4; i++) {
        if (bits >= 8) {
            octetosMascara.push(255);
            bits -= 8;
        } else if (bits > 0) {
            octetosMascara.push(256 - Math.pow(2, 8 - bits));
            bits = 0;
        } else {
            octetosMascara.push(0);
        }
    }

    return octetosMascara.join(".");
}

function obtenerSalto(prefijo) {
    let posicion = Math.floor(prefijo / 8);
    let residuo = prefijo % 8;

    if (residuo === 0) {
        return "1 en el octeto " + posicion;
    }

    let salto = Math.pow(2, 8 - residuo);
    return salto + " en el octeto " + (posicion + 1);
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

    btnVerificar.disabled = false;
    btnGenerar.disabled = true;
    btnLimpiar.disabled = true;

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
    btnClaseA.classList.remove("clase-activa");
    btnClaseB.classList.remove("clase-activa");
    btnClaseC.classList.remove("clase-activa");

    if (tipo === "A") {
        btnClaseA.classList.add("clase-activa");
    }

    if (tipo === "B") {
        btnClaseB.classList.add("clase-activa");
    }

    if (tipo === "C") {
        btnClaseC.classList.add("clase-activa");
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

        if (input === cantidadSubredes && input.value.length > 4) {
            input.value = input.value.slice(0, 4);
        }
    };
}

soloNumeros(oct1);
soloNumeros(oct2);
soloNumeros(oct3);
soloNumeros(oct4);
soloNumeros(cantidadSubredes);

activarIP(false);
btnVerificar.disabled = true;
btnGenerar.disabled = true;
btnLimpiar.disabled = true;
cantidadSubredes.disabled = true;

tablaSubredes.innerHTML = `
    <tr>
        <td colspan="6" class="sin-datos">Seleccione una clase para comenzar.</td>
    </tr>
`;