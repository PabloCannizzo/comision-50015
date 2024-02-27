const express = require("express");
const router = express.router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async(req, res) => {
    const {first_name, last_name, email, password, age} = req.body;
    try {
        await UserModel.create({first_name, last_name, email, password, age, rol:"user"});
        res.status(200).send({massage: "Usuario creado con exito!"});
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router; 