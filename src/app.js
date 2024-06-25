const express = require("express");
const PUERTO = process.env.PUERTO || 8080;
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




//////////// swagger //////////////////////

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
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


const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets: rs
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);