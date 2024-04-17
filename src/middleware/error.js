const { EErrors } = require("../service/errors/enums.js");

const manejadorError = (error, req, res, next) => {
    console.log(error.causa);
    console.log("Ocurrio un error");
    switch (error.code) {
        case EErrors.TIPO_INVALIDO:
            res.send({ status: "error", error: error.nombre })
            break;
        default:
            res.send({ status: "error", error: "Error desconocido" })
    }
}

module.exports = manejadorError;