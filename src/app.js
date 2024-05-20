const express = require("express");
const PUERTO = 8080;
const app = express();

const productsRouter = require("./routes/products.router.js");
const viewsRouter = require("./routes/views.router.js");
const cartsRouter = require("./routes/carts.router.js");
const userRouter = require("./routes/user.router.js");

const contactRouter = require("./routes/contact.router.js");
const usermocksRouter = require("./routes/usermocks.router.js");
const manejadorError = require("./middleware/error.js");
const compression = require("express-compression");

const exphbs = require("express-handlebars");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const addLogger = require("./utils/logger.js");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");


//Passport:
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
////////////////////////////////
require("./database.js");

//const socket = require("socket.io");
//const imagenRouter = require("./routes/imagen.router.js");

//const FileStore = require("session-file-store");
//const fileStore = FileStore(session);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());


initializePassport();
app.use(cookieParser());
app.use(passport.initialize());

const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

app.use(addLogger);


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);

app.use("/contact", contactRouter);
app.use("/mockingproducts", usermocksRouter);

//app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Manejo de compresion de nuestra app. Optimizacion
app.use(compression({
    brotli: { enabled: true, zlib: {} }
}));

// Manejo de errores
app.use(manejadorError);//

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

app.use(multer({ storage }).single("image"));


// Implementacion de Logger

app.get("/loggertest", (req, res) => {

    req.logger.fatal("Error fatal");
    req.logger.error("Mensaje de Error");
    req.logger.warning("Mensaje de Warning");
    req.logger.info("Mensaje de Info");
    req.logger.http("mensaje de http");
    req.logger.debug("Mensaje de debug" + `Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

    res.send("Test de logs");

})

// simulacion de operaciones simples y complejas. Aplicamos Artillery

app.get("/operacionsimple", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
        suma += i;
    }
    res.send({ suma });
})

app.get("/operacioncompleja", (req, res) => {
    let suma = 0;
    for (let i = 0; i < 5e8; i++) {
        suma += i;
    }
    res.send({ suma });
})

// artillery quick --count 40 --num 50 "http://localhost:8080/operacioncompleja" -o compleja.json

// artillery quick --count 40 --num 50 "http://localhost:8080/operacionsimple" -o simple.json

/////////////////// 
// DETERMINO EL NUMERO DE PROCESADORES QUE TENGO
const cluter = require("cluster");
const { cpus } = require("os");
const numeroDeProcesadores = cpus().length;
console.log("Número de procesadores:", numeroDeProcesadores);

//////////// swagger //////////////////////

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion de la App E-commerce",
            description: "App dedicada a nuestro proyecto de Backend"
        }
    },
    apis: ["./src/docs/**/*.yaml"]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));


//app.use("/", imagenRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets: rs
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);