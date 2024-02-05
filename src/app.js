const express = require("express");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const socket = require("socket.io");
const viewsRouter = require("./routes/views.router.js");
const cartsRouter = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const multer = require("multer");
const ProductManager = require("./dao/fs/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");
require("./database.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);
//app.use("/static", express.static(path.join(__dirname, "..", "public")));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
})

const MessageModel = require("./dao/models/massage.model.js");
const io = new socket.Server(httpServer);


io.on("connection", (socket) => {
    console.log("Nuevo usuario conectado");

    socket.on("message", async data => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        console.log(messages);
        io.sockets.emit("message", messages);
    })
})