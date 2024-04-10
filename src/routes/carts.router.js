const express = require("express");
const router = express.Router();
const CartsController = require("../controllers/carts.controller.js");
const cartsController = new CartsController();
const authMiddleware = require("../middleware/authmiddleware.js");

router.use(authMiddleware);
router.post("/", cartsController.createCarts);
router.get("/:cid", cartsController.getCarts);
router.post("/:cid/product/:pid", cartsController.addProductsInCarts);
router.delete("/:cid/product/:pid", cartsController.deleteProducts);
router.put("/:cid", cartsController.updateCarts);
router.put("/:cid/product/:pid", cartsController.updateProductsCarts);
router.delete("/:cid", cartsController.deleteCarts);
router.post("/:cid/purchase", cartsController.finalizePurchase);



module.exports = router;