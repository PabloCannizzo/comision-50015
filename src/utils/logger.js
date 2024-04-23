const winston = require("winston");

const logger = winston.createLogger({
    // le paso un objeto de configuracion.
    transports: [
        new winston.transports.Console({level:"http"}),

        //Agregamos un nuevo transporte:
        new winston.transports.File({
            filename: "./errors.log",
            level: "warn",
        })
    ]
})

// Creamos un middleware:

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;