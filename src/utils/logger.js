const winston = require("winston");
const configObject = require("../config/config.js");
const { MONGO_URL } = configObject;

const niveles = {

    nivel: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },

    colores: {
        fatal: "red",
        error: "yellow",
        warning: "blue",
        info: "green",
        http: "magenta",
        debug: "white"
    }
}

//Logger para desarrollo: 

const loggerDevelopment = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: niveles.colores }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: "./developmentError.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})


//Logger para producción: 

const loggerProduction = winston.createLogger({
    levels: niveles.nivel,
    transports: [
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({ colors: niveles.colores }),
                winston.format.simple()
            )
        }),

        new winston.transports.File({
            filename: "./productionErros.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

//Determinar que logger utilizar segun el entorno: 

const logger = MONGO_URL === "produccion" ? loggerProduction : loggerDevelopment;

// Creamos un middleware:

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;