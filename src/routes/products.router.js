const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();


router.get("/", productController.getProducts);
router.post("/", productController.addProduct);
router.get("/:pid", productController.getProductsById);
router.put("/:pid", productController.updateProducts);
router.delete("/:pid", productController.deleteProducts);

module.exports = router; 

// NOTA: CAMBIAR UBICACION DE RUTAS A CONTROLLER, GUIANDOME DE LOS REPOSITORIOS DEL PROFESOR, CLASE N°27. A SU VEZ APLICAR CON METODO JWT