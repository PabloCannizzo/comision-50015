const express = require("express");
const router = express.Router();
const ContactController = require("../controllers/contact.controller.js");
const contactController = new ContactController();

router.get("/sms", contactController.getSms);


module.exports = router; 