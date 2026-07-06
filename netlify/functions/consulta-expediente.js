exports.handler = async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        mensaje: "Backend funcionando correctamente.",
        configuracion: {
          airtable_base: process.env.AIRTABLE_BASE_ID ? "OK" : "FALTA",
          airtable_table: process.env.AIRTABLE_TABLE ? "OK" : "FALTA",
          airtable_token: process.env.AIRTABLE_TOKEN ? "OK" : "FALTA"
        }
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        error: error.message
      })
    };
  }
};