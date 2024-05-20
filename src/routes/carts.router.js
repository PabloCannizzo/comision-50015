const express = require("express");
const router = express.Router();
const CartsController = require("../controllers/carts.controller.js");
const cartController = new CartsController();
const authMiddleware = require("../middleware/authmiddleware.js");

router.use(authMiddleware);

router.post("/", cartController.nuevoCarrito);

router.get("/:cid", cartController.obtenerProductosDeCarrito);
router.delete('/:cid', cartController.vaciarCarrito);
router.put('/:cid', cartController.actualizarProductosEnCarrito);

router.put("/:cid/product/:pid", cartController.actualizarCantidad);
router.post("/:cid/product/:pid", cartController.agregarProductoEnCarrito);
router.delete("/:cid/product/:pid", cartController.eliminarProductoDeCarrito);

router.post('/:cid/purchase', cartController.finalizarCompra);


module.exports = router;