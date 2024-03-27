const express = require("express");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const viewsRouter = require("./routes/views.router.js");
const cartsRouter = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const multer = require("multer");
const ProductManager = require("./dao/fs/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/session.router.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
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
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority", ttl: 100
    })
}));
//////////// cambios Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());



app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
app.use("/api/users", userRouter);
app.use("/api/sessions", sessionRouter);

//app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");



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



app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
});