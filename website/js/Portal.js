document.addEventListener("DOMContentLoaded", () => {

    const tokenInput = document.getElementById("token");
    const resultado = document.getElementById("resultado");
    const boton = document.getElementById("btnConsultar");

    // Leer el token desde la URL
    const params = new URLSearchParams(window.location.search);
    const tokenURL = params.get("token");

    if (tokenInput && tokenURL) {
        tokenInput.value = tokenURL;
    }

    // Evento del botón
    if (boton) {
        boton.addEventListener("click", consultarExpediente);
    }

    // Si el token vino en la URL, consultar automáticamente
    if (tokenURL) {
        consultarExpediente();
    }

    async function consultarExpediente() {

        const token = tokenInput.value.trim();

        if (!token) {

            resultado.innerHTML = `
                <div class="mensaje error">
                    Debe ingresar el código de acceso.
                </div>
            `;

            return;
        }

        resultado.innerHTML = `
            <div class="mensaje">
                Consultando expediente...
            </div>
        `;

        try {

            const response = await fetch(
                "/.netlify/functions/consulta-expediente",
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

            const data = await response.json();

            if (!data.ok) {

                resultado.innerHTML = `
                    <div class="mensaje error">
                        ${data.mensaje}
                    </div>
                `;

                return;
            }

            resultado.innerHTML = `

                <div class="resultado-card">

                    <h2>Expediente Nº ${data.expediente}</h2>

                    <hr>

                    <p>
                        <strong>Estado:</strong>
                        ${data.estado}
                    </p>

                    <p>
                        <strong>Próxima acción:</strong>
                        ${data.proximaAccion || "-"}
                    </p>

                    <p>
                        <strong>Documentación:</strong>
                        ${data.documentacion || "-"}
                    </p>

                    <p>
                        <strong>Ofrecimiento:</strong>
                        ${data.ofrecimiento || "-"}
                    </p>

                    <hr>

                    <small>

                        Última actualización:

                        ${new Date(data.fechaConsulta).toLocaleString("es-AR")}

                    </small>

                </div>

            `;

        }

        catch (error) {

            console.error(error);

            resultado.innerHTML = `

                <div class="mensaje error">

                    Error al conectar con el servidor.

                </div>

            `;

        }

    }

});