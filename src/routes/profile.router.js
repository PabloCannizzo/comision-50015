const express = require("express");
const router = express.Router();

router.get("/profile", (req, res) => {
    if(!req.session.login){
        return res.redirect("/login");
    }
    res.render("profile", {user:req.session.user});
})