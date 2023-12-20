const ProductManager = require("./product-manager");
const manager = new ProductManager("./src/productos.json");
const express = require("express");
const PUERTO = 8080;

const app = express();

/* app.get("/", (req, res) =>{
    res.send("Mi primer server con Express");
}) */

app.get("/products", async(req, res) => {
    try {
        const arrayProductos = await manager.leerArchivo();
        let limit = parseInt(req.query.limit);
        if(limit){
            const arrayConLimite = arrayProductos.slice(0, limit);
            return res.send(arrayConLimite);
        } else {
            return res.send(arrayProductos);
        }
    } catch (error) {
        console.log(error);
        return res.send("Error al procesar la solicitud");
    }
})

app.get("/products/:pid", async(req, res) => {
    try {
        let pid = parseInt(req.params.pid);

        const buscado = await manager.getProductById(pid);

        if(buscado){
            return res.send(buscado);
        } else {
            return res.send ("ID de producto incorrecto, vuelva a intentarlo más tarde...");
        }
    } catch (error) {
        console.log(error);
        res.send("Error al buscar...")
    }
})

app.listen(PUERTO, () => {
    console.log(`Escuchando en http://localhost:${PUERTO}`);
})