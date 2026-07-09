const Airtable = require("airtable");
console.log("===== VARIABLES =====");
console.log("TOKEN:", process.env.AIRTABLE_TOKEN ? "OK" : "VACÍO");
console.log("BASE:", process.env.AIRTABLE_BASE_ID);
console.log("TABLA:", process.env.AIRTABLE_TABLE);
console.log("=====================");

const base = new Airtable({
    apiKey: process.env.AIRTABLE_TOKEN
}).base(process.env.AIRTABLE_BASE_ID);

exports.handler = async (event) => {

    if (event.httpMethod !== "POST") {

        return {
            statusCode: 405,
            body: JSON.stringify({
                ok: false,
                mensaje: "Método no permitido."
            })
        };

    }

    try {

        const body = JSON.parse(event.body);

        const token = (body.token || "").trim();

        if (!token) {

            return {
                statusCode: 400,
                body: JSON.stringify({
                    ok: false,
                    mensaje: "Token inexistente."
                })
            };

        }

        const tabla = base(process.env.AIRTABLE_TABLE);

        const registros = await tabla
            .select({
                maxRecords: 1,
                filterByFormula: `{Token_Cliente}='${token}'`
            })
            .firstPage();

        if (registros.length === 0) {

            return {
                statusCode: 404,
                body: JSON.stringify({
                    ok: false,
                    mensaje: "Expediente no encontrado."
                })
            };

        }

        const registro = registros[0];

        const datos = registro.fields;

        // ==========================================
        // Actualizar estadísticas del Portal
        // ==========================================

        const consultas = Number(datos["Cantidad_Consultas"] || 0) + 1;

        await tabla.update(registro.id, {

            "Cantidad_Consultas": consultas,

            "Fecha_ultimo_acceso": new Date().toISOString()

        });

        // ==========================================
        // Respuesta al Portal
        // ==========================================

        return {

            statusCode: 200,

            body: JSON.stringify({

                ok: true,

                expediente:
                    datos["Número de Expediente"],

                actor:
                    datos["Actor"],

                estado:
                    datos["Estado del Expediente"],

                fechaActualizacion:
                    datos["Fecha_última_Actualización"] || "",

                proximaAccion:
                    datos["Próxima_Accion"] || "",

                documentacion:
                    datos["Documentacion"] || "",

                documentacionPendiente:
                    datos["Doc_Faltante"] || "",

                ofrecimiento:
                    datos["Ofrecimiento"] || "",

                consultas:
                    consultas

            })

        };

    }

    catch (error) {

        console.error(error);

        return {

            statusCode: 500,

            body: JSON.stringify({

                ok: false,

                mensaje: "Error interno.",

                detalle: error.message

            })

        };

    }

};