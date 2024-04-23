const UserModel = require("../dao/models/user.model.js");
const CartModel = require("../dao/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const CustomError = require("../service/errors/custom-errors.js");
const { generarInfoError } = require("../service/errors/info.js");
const { EErrors } = require("../service/errors/enums.js");
const answer = require("../utils/reusable.js");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age, role } = req.body;
        try {
            const existeUsuario = await UserModel.find({ first_name, last_name, email });
            if (!existeUsuario) {
                throw CustomError.crearError({
                    nombre: "Usuario nuevo",
                    causa: generarInfoError({ first_name, last_name, email }),
                    mensaje: "Error al intentar crear un nuevo usuario",
                    codigo: EErrors.TIPO_INVALIDO
                });
            }
            const nuevoCarrito = new CartModel();
            await nuevoCarrito.save();

            const nuevoUsuario = new UserModel({
                first_name,
                last_name,
                email,
                cart: nuevoCarrito._id,
                password: createHash(password),
                age
            });

            await nuevoUsuario.save();
            console.log(nuevoUsuario());

            const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            
            res.redirect("/api/users/profile");
        } catch (error) {
            // console.error(error);
            req.logger.error("Error Interno del servidor");
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                req.logger.error("Usuario no valido");
                return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                req.logger.error("Contraseña Incorrecta");
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
        } catch (error) {
            // console.error(error);
            req.logger.error("Error interno del servidor!");
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        //Con DTO: 
        const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
        const isAdmin = req.user.role === 'admin';
        res.render("profile", { user: userDto, isAdmin });
    }

    async logout(req, res) {
        res.clearCookie("coderCookieToken");
        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }
}

module.exports = UserController;