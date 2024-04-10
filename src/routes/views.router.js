const express = require("express");
const router = express.Router();
const ViewController = require("../controllers/views.controller");
const viewController = new ViewController();
const passport = require("passport");
const checkUserRole = require("../middleware/checkrole.js");


router.get("/products", checkUserRole(['user']),passport.authenticate('jwt', { session: false }), viewController.renderProducts.bind(viewController));
router.get("/carts/:cid", viewController.renderCarts);
router.get("/login", viewController.renderlogin);
router.get("/register", viewController.renderRegister);
router.get("/realtimeproducts", checkUserRole(["admin"]), viewController.renderRealTimeProducts);
router.get("/chat", checkUserRole(["user"]), viewController.renderChat);
router.get("/", viewController.renderHome);



module.exports = router; 