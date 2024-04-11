const express = require("express");
const router = express.Router();
const ViewController = require("../controllers/views.controller.js");
const viewsController = new ViewController();
const passport = require("passport");
const checkUserRole = require("../middleware/checkrole.js");


router.get("/products", checkUserRole(['usuario']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['admin']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);
router.get("/", viewsController.renderHome);



module.exports = router; 