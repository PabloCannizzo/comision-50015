const express = require("express");
const PUERTO = 8080;
const app = express();
const productsRouter = require("./routes/products.router.js");
const socket = require("socket.io");
const viewsRouter = require("./routes/views.router.js");
const cartsRouter = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const multer = require("multer");
const ProductManager = require("./controllers/product-manager.js");
const productManager = new ProductManager("./src/models/productos.json");

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

/* app.get("/", (req, res) => {
    res.render("index", { titulo: "Index" });
})

app.get("/realTimeProducts", (req, res) => {
    res.render("realTimeProducts", { titulo: "Real Time Products" });
})
 */
const server = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
})

const io = socket(server);

io.on("connection", async (socket) =>{
    console.log("CLIENTE CONECTADO");
    socket.emit("productos", await productManager.getProducts());
    socket.on("eliminarProducto", async (id) =>{
        await productManager.deleteProduct(id);
        io.sockets.emit("prodcutos", await productManager.getProducts());
    });
    socket.on("agregarProducto", async (producto) => {
        await productManager.addProduct(producto);
        io.socket.emit("productos", await productManager.getProducts());
    });
})