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
const imagenRouter = require("./routes/imagen.router.js");

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


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/public/img");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

app.use(multer({ storage }).single("image"));

app.use("/", imagenRouter);



const httpServer = app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
})

const ProductModel = require("./dao/models/product.model.js");
const CartModel = require("./dao/models/cart.model.js");
const io = new socket.Server(httpServer);


io.on("connection", async (socket) => {
    console.log("Nuevo usuario conectado"); 
    //socket.emit("productos", await ProductModel.find());
    socket.on("contenerdorProductos", async (data) => {
        const productos = await ProductModel.find();
        console.log(productos);
        io.sockets.emit("productos", contenerProductos);
    })

    socket.on("eliminarProducto", async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit("productos", await productManager.getProducts());
    });
    socket.on("products", async data =>{
        await ProductModel();
        io.sockets.emit("products");
    })
});