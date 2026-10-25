// ==========================================================
// ESTUDIO NEGRETTE — Web
// Consulta Expediente Netlify Function
// ----------------------------------------------------------
// IMPORTANTE — REEMPLAZO:
//
// Esta función antes consultaba Airtable directamente. Ahora
// consulta a NLOS (el sistema de gestión real del estudio),
// que es quien tiene el estado real y actualizado de cada
// expediente.
//
// Portal.js NO CAMBIA — sigue llamando a esta misma función,
// con el mismo método (POST) y la misma forma de respuesta
// ({ok, mensaje, expediente, actor, estado, ...}).
// ==========================================================


const NLOS_STATUS_URL =
    "https://negrette-legal-os.netlify.app/.netlify/functions/get-case-status-by-token";


function json(

    data,

    statusCode = 200

) {

    return {

        statusCode,

        headers: {
            "Content-Type":
                "application/json"
        },

        body:
            JSON.stringify(data)

    };

}


exports.handler = async function handler(

    event

) {

    try {

        if (

            event.httpMethod !==

            "POST"

        ) {

            return json(

                {
                    ok: false,
                    mensaje:
                        "Método no permitido."
                },

                405

            );

        }

        const body =

            JSON.parse(

                event.body ||

                "{}"

            );

        const token =

            body.token;

        if (!token) {

            return json(

                {
                    ok: false,
                    mensaje:
                        "Debe ingresar un código de acceso."
                },

                400

            );

        }

        const response =

            await fetch(

                `${NLOS_STATUS_URL}?token=${encodeURIComponent(token)}`

            );

        const datos =

            await response.json();

        return json(

            datos,

            response.status

        );

    }

    catch (error) {

        console.error(

            "Consulta Expediente Function error:",

            error

        );

        return json(

            {
                ok: false,
                mensaje:

                    "No fue posible conectar con el servidor."
            },

            500

        );

    }

}