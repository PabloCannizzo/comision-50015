const express = require("express");
const router = express.Router(); 
const ProductModel = require("../dao/models/product.model.js");


router.get("/", async (req, res) => {
    try {
        const productos = await ProductModel.find();
        res.render("index", {productos: productos});
    } catch (error) {
        console.error("Error al obtener los productos", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
})

router.get("/carts", async (req, res) =>{
    try {
        res.render("carts");
    } catch (error) {
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
})

module.exports = router; 