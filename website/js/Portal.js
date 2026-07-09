/* ==========================================================
   ESTUDIO NEGRETTE
   Portal del Cliente
   Sprint 4.4
   Archivo: website/js/portal.js
========================================================== */

const API = "/.netlify/functions/consulta-expediente";

/* ==========================================================
   Utilidades
========================================================== */

function $(id) {
    return document.getElementById(id);
}

function mostrarCarga() {
    $("error").style.display = "none";
    $("resultado").style.display = "none";
    $("cargando").style.display = "block";
}

function ocultarCarga() {
    $("cargando").style.display = "none";
}

function mostrarError(mensaje) {

    ocultarCarga();

    $("error").style.display = "block";
    $("error").innerHTML = mensaje;

}

function formatearFecha(fecha) {

    if (!fecha) return "-";

    const d = new Date(fecha);

    if (isNaN(d.getTime()))
        return fecha;

    return d.toLocaleDateString(
        "es-AR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );

}

function aplicarColorEstado(textoEstado) {

    const estado = $("estado");

    estado.className = "estado";

    if (!textoEstado)
        return;

    const t = textoEstado.toLowerCase();

    if (t.includes("nuevo")) {

        estado.classList.add("nuevo");

    }
    else if (
        t.includes("document")
        || t.includes("pedido")
    ) {

        estado.classList.add("documentacion");

    }
    else if (
        t.includes("análisis")
        || t.includes("analisis")
    ) {

        estado.classList.add("analisis");

    }
    else if (
        t.includes("liquid")
    ) {

        estado.classList.add("liquidado");

    }
    else if (
        t.includes("cerr")
    ) {

        estado.classList.add("cerrado");

    }

}

/* ==========================================================
   Actualiza la pantalla
========================================================== */

function actualizarPantalla(datos) {

    $("panelIngreso").style.display = "none";
    $("resultado").style.display = "block";

    $("tituloExpediente").innerHTML =
        "Expediente Nº " + datos.expediente;

    $("actor").innerHTML =
        datos.actor || "-";

    $("estado").innerHTML =
        datos.estado || "-";

    aplicarColorEstado(datos.estado);

    $("fechaActualizacion").innerHTML =
        formatearFecha(datos.fechaActualizacion);

    $("proximaAccion").innerHTML =
        formatearFecha(datos.proximaAccion);

    $("documentacion").innerHTML =
        datos.documentacion || "Sin información.";

    $("documentacionPendiente").innerHTML =
        datos.documentacionPendiente || "Ninguna.";

    $("ofrecimiento").innerHTML =
        datos.ofrecimiento || "Sin ofrecimiento.";

    $("consultas").innerHTML =
        datos.consultas || 1;

    $("btnWhatsapp").href =
        "https://wa.me/543816301433?text=" +
        encodeURIComponent(
            "Hola Estudio Negrette. Deseo consultar el expediente Nº " +
            datos.expediente
        );

}

/* ==========================================================
   Consulta principal
========================================================== */

async function consultar(tokenManual = null) {

    mostrarCarga();

    let token = tokenManual;

    if (!token) {

        token = $("token").value.trim();

    }

    if (!token) {

        mostrarError(
            "Debe ingresar un código de acceso."
        );

        return;

    }

    try {

        const respuesta = await fetch(
            API,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: token
                })
            }
        );

        const datos = await respuesta.json();

        ocultarCarga();

        if (!datos.ok) {

            mostrarError(
                datos.mensaje
            );

            return;

        }

        actualizarPantalla(datos);

    }

    catch (error) {

        console.error(error);

        mostrarError(
            "No fue posible conectar con el servidor."
        );

    }

}

/* ==========================================================
   Inicio automático mediante Token
========================================================== */

window.onload = function () {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const token =
        parametros.get("token");

    if (token) {

        consultar(
            token.trim()
        );

    }

};