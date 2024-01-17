const express = require("express");
const router = express.Router(); 
const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/prodcutos.json");

router.get("/", async (req, res) => {
    try {
        const productos = await productManager.getProducts();
        res.render("index", {productos: productos});
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/realTimeProducts", async (req, res) =>{
    try {
        res.render("realTimeProducts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

module.exports = router;