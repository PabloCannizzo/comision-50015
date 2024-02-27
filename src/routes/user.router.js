const express = require("express");
const router = express.router();
const UserModel = require("../dao/models/user.model.js");

router.post("/", async(req, res) => {
    const {first_name, last_name, email, password, age} = req.body;
    try {
        const userExist = await UserModel.findOne({first_name, last_name, email, password, age});
        if(userExist){
            return res.status(400).send({error: "El correo electronico ingresado, ya se encuentra registrado"});
        }
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        })
        res.redirect("/login");
        
    } catch (error) {
        res.status(400).send({error: "Error al crear el usuario"});
    }
})

module.exports = router; 