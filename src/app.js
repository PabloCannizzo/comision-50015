const express = require("express");
const PUERTO = 8080;
const app = express();

const productsRouter = require("./routes/products.router.js");
const viewsRouter = require("./routes/views.router.js");
const cartsRouter = require("./routes/carts.router.js");
const userRouter = require("./routes/user.router.js");

const contactRouter = require("./routes/contact.router.js");
const mailRouter = require("./routes/mail.router.js");
const usermocksRouter = require("./routes/usermocks.router.js");
const manejadorError = require("./middleware/error.js");

const exphbs = require("express-handlebars");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");


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


app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);

app.use("/contact", contactRouter);
app.use("/mail", mailRouter);
app.use("/mockingproducts", usermocksRouter);

//app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

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

//app.use("/", imagenRouter);

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});

///Websockets: rs
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);