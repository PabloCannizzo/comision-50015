const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const arrayProductos = await productManager.getProducts();
        const limit = parseInt(req.query.limit);
        if (limit) {
            const arrayConLimite = arrayProductos.slice(0, limit);
            return res.json(arrayConLimite);
        } else {
            return res.json(arrayProductos);
        }
    } catch (error) {
        console.log(error);
        return res.json("Error al procesar la solicitud");
    }
})

router.post("/", async (req, res) => {
    const { title, description, price, img, code, stock, category } = req.body;
    try {
        await productManager.addProduct({ title, description, price, img, code, stock, category });
        res.json({ status: "success", message: "Producto agregado con éxito" });
    } catch (error) {
        console.error("Producto no creado", error);
        res.status(404).json({ status: "error", message: "Error al crear el producto" });
    }
});

router.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    try {
        const buscado = await productManager.getProductById(pid); // id

        if (buscado) {
            return res.json(buscado);
        } else {
            return res.json("ID de producto incorrecto");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: "error", message: "Error al buscar el producto" });
    }
})

router.put("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    try {
        await productManager.updateProduct(productId, updatedProduct);
        res.json({ status: "success", message: "Producto actualizado con éxito" });
        console.log("Producto actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(404).json({ status: "error", message: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;
    try {
        if(productId){
            await productManager.deleteProduct(productId);
            res.json({ status: "success", message: "Producto eliminado con éxito" });
            const products = await productManager.getProducts();
        res.send(products);
        }
        return console.log("Producto eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(404).json({ status: "error", message: "Error al eliminar el producto" });
    }
});

module.exports = router;