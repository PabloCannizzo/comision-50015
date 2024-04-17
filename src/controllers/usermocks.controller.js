const generarUsuarios = require("../utils/generateusers.js");

class GenerarUsuarios {
    async usuarios(req, res) {
        //Generamos un array de usuarios:
        const usuarios = [];
        for (let i = 0; i < 100; i++) {
            usuarios.push(generarUsuarios());
        }
        res.json(usuarios);
    }
}

module.exports = GenerarUsuarios;