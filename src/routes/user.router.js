const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { createHash } = require("../utils/hashBcrypt.js");
const passport = require("passport");


/////////////// VERSION NUEVA //////////////////
//Post para generar un usuario y almacenarlo en MongoDB

router.post("/", async (req, res) => {

    const { username, first_name, last_name, email, password, age, role = "user" } = req.body;

    try {
        const existingUser = await UserModel.findOne({ email: email});

        if(existingUser){
            return res.status(400).send({ error: "el correo electronico ya existe en la base de datos!"});
        }

    // crear un nuevo usuario
        const newUser = await UserModel.create({ username, first_name, last_name, email, password:createHash(password), age });

        req.session.login = true;
        req.session.user = {
            email: newUser.email,
            age: newUser.age
        }; 
        req.session.user = { ...newUser._doc};

        res.status(200).send({ message: "Usuario creado con exito" });
    } catch (error) {
        console.log("Error al crear el usuario:", error);
        res.status(400).send({ error: "Error al crear el usuario" });
    }
})


//////////////// VERSION VIEJA ////////////////////


/* 
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, age } = req.body;
    try { //create
        const userExist = await UserModel.findOne ({ first_name, last_name, email, password, age });
        if (userExist) {
            return res.status(400).send({ error: "El correo electronico ingresado, ya se encuentra registrado" });
        }
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        });
        //res.status(200).send({message: "Usuario creado con exito"})
        res.redirect("/login");

    } catch (error) {
        res.status(400).send({ error: "Error al crear el usuario" });
    }
})
 */

//////////////// VERSION PARA PASSPORT ///////////////

router.post("/", passport.authenticate("register", {
    failureRedirect: "/failedregister"
}), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Credenciales Invalidas" });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile"); //o al /login
})

router.get("/failedregister", (req, res) => {
    res.send({error: "Registro Fallido" });
})

module.exports = router; 