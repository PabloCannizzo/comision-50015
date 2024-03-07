const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");


// (/sessionlogin)
/* router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await UserModel.findOne({ email: email });
        if (usuario) {
            //Login
            //USO isValidPassword para verificar el pass:
            //if (usuario.password === password) {
            if (isValidPassword(password, usuario)) {
                req.session.login = true;
                req.session.user = {
                    first_name: usuario.first_name,
                    last_name: usuario.last_name,
                    email: usuario.email,
                    age: usuario.age
                }
                res.status(200).send({ message: "LOGIN CORRECTO" });
                res.redirect("/profile"); //profile
            } else {
                res.status(401).send({ error: "CONTRASEÑA INCORRECTA" });
            }
        } else {
            res.status(404).send({ error: "USUARIO NO ENCONTRADO" });
        }
    } catch (error) {
        res.status(400).send({ error: "ERROR EN EL LOGIN" });
    }
}); */


//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.redirect("/login");
    res.status(200).send({ message: "Login Eliminado" });
});

/////////////////////////////////////////
//VERSION CON PASSPORT

router.post("/login", passport.authenticate("login", { failureRedirect: "/api/sessions/faillogin" }), async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Credenciales Invalidas" });

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    };

    req.session.login = true;

    res.redirect("/profile");
})

router.get("/faillogin", async (req, res) => {
    console.log("Fallo la estrategia");
    res.send({ error: "Fallo" });
})

/////////////////// VERSION PARA GITHUB /////////////////////////

router.get("/github", passport.authenticate("github", {scope: ["user:email"]}), async (req, res) => {})

router.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), async (req, res) => {
    //La estrategia de github nos retornara el usuario, entonces lo agregamos a nuestro objeto de ssion.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})

module.exports = router;



/* if (usuario) {
    //Login
    if (usuario.password === password) {
        req.session.login = true;
        res.status(200).send({ message: "Login correcto!" });
    } else {
        res.status(401).send({ error: "Contraseña no valida" });
    }
} else {
    res.status(404).send({ error: "Usuario no encontrado" });
}
} catch (error) {
res.status(400).send({ error: "ERROR EN EL LOGIN" }); */