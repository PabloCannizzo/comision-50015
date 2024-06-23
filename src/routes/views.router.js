const express = require("express");
const router = express.Router();
const ViewController = require("../controllers/views.controller.js");
const viewsController = new ViewController();
const passport = require("passport");
const checkUserRole = require("../middleware/checkrole.js");


router.get("/products", checkUserRole(['usuario', 'premium']),passport.authenticate('jwt', { session: false }), viewsController.renderProducts);
router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/realtimeproducts", checkUserRole(['usuario', 'premium']), viewsController.renderRealTimeProducts);
router.get("/chat", checkUserRole(['usuario']) ,viewsController.renderChat);
router.get("/", viewsController.renderHome); 
// Comentado (/home)
router.get("/reset-password", viewsController.renderResetPassword);
router.get("/password", viewsController.renderCambioPassword);
router.get("/confirmacion-envio", viewsController.renderConfirmacion);
router.get("/panel-premium", viewsController.renderPremium);


module.exports = router; 