const GenerarUsuarios = require("../controllers/usermocks.controller.js");
const generarUsuarios = new GenerarUsuarios();
const express = require("express");
const router = express.Router();

router.get("/", generarUsuarios.usuarios);

module.exports = router;