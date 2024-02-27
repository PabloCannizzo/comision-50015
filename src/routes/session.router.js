const cookieParser = require("cookie-parser");
const express = require("express");
const router = express.Router();


router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.findOne({email: email});

        if(user){
            if(isValidPassword(password, user)){
                req.session.login = true;
                req.session.user = {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age
                }
                res.redirect("/products");
            } else {
                res.status(400).send ({error: "CONTRASEÑA INVALIDA"});
            }
        } else {
            res.status(400).send ({error: "USUARIO NO ENCONTRADO"});
        }
    } catch (error) {
        res.status(404).send ({error: "ERROR EN EL REGISTRO"});
    }
})

module.exports = router;