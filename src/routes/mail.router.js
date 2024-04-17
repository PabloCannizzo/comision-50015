const express = require("express");
const router = express.Router();
const MailController = require("../controllers/mail.controller.js");
const mailController = new MailController();

router.get("/mailplantilla", mailController.getMailPlantilla);
router.get("/mail", mailController.getMail);
router.get("/contacto", mailController.getContacto);
router.post("/enviarmensaje", mailController.postSendMessage);

module.exports= router;