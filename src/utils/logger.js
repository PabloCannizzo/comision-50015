const winston = require("winston");
const configObject = require("../config/config.js");
const { node_env } = configObject;

// const logger = winston.createLogger({
//     // le paso un objeto de configuracion.
//     transports: [
//         new winston.transports.Console({ level: "http" }),

//         //Agregamos un nuevo transporte:
//         new winston.transports.File({
//             filename: "./errors.log",
//             level: "warn",
//         })
//     ]
// })

// Ejemplo configurando nuestro propios niveles:
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

const logger = node_env === "produccion" ? loggerProduction : loggerDevelopment;


// const logger = winston.createLogger({
//     levels: niveles.nivel,
//     transports: [
//         new winston.transports.Console({
//             level: "http",
//             format: winston.format.combine(
//                 winston.format.colorize({ colors: niveles.colores }),
//                 winston.format.simple()
//             )
//         }),
//         new winston.transports.File({
//             filename: "./developmentErrors.log",
//             level: "debug",
//             format: winston.format.simple()
//         })
//     ]

// levels: niveles.nivel,
// transports: [
//     new winston.transports.Console({
//         level: "http",
//         format: winston.format.combine(
//             winston.format.colorize({ colors: niveles.colores }),
//             winston.format.simple()
//         )
//     }),
//     new winston.transports.File({
//         filename: "./productionErros.log",
//         level: "info",
//         format: winston.format.simple()
//     })
// ]
// })

// Creamos un middleware:

const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
    next();
}

module.exports = addLogger;