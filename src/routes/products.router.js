const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();


router.get("/", productController.getProducts);
router.post("/", productController.addProduct);
router.get("/:pid", productController.getProductById);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router; 

// NOTA: CAMBIAR UBICACION DE RUTAS A CONTROLLER, GUIANDOME DE LOS REPOSITORIOS DEL PROFESOR, CLASE N°27. A SU VEZ APLICAR CON METODO JWT