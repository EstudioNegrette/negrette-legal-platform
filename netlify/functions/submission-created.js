// Estudio Negrette - Web
// Netlify llama a "submission-created" en cada envio de formulario.
// Reenvia el formulario "reclamos" a NLOS, que crea el expediente.

const NLOS_INTAKE_URL =
  process.env.NLOS_INTAKE_URL ||
  "https://negrette-legal-os.netlify.app/.netlify/functions/intake-web-case";

const CAMPOS = [
  "nombre", "dni", "telefono", "email", "fecha", "lugar", "descripcion",
  "vehiculo_marca_modelo", "vehiculo_dominio", "vehiculo_aseguradora",
  "otro_marca_modelo", "otro_dominio", "otro_titular", "otro_conductor",
  "otro_aseguradora", "observaciones",
];

exports.handler = async function (event) {
  try {
    const payload = JSON.parse(event.body).payload || {};

    if (payload.form_name !== "reclamos") {
      return { statusCode: 200, body: "ignorado (no es el formulario de reclamos)" };
    }

    const data = payload.data || {};
    const body = {};
    for (const c of CAMPOS) body[c] = data[c];

    const headers = { "Content-Type": "application/json" };
    if (process.env.NLOS_INTAKE_SECRET) {
      headers["x-nlos-intake-secret"] = process.env.NLOS_INTAKE_SECRET;
    }

    const response = await fetch(NLOS_INTAKE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error("submission-created: NLOS respondio", response.status, await response.text());
    } else {
      console.log("submission-created: expediente creado en NLOS");
    }

    return { statusCode: 200, body: "ok" };
  } catch (error) {
    console.error("submission-created error:", error);
    return { statusCode: 200, body: "error manejado" };
  }
};