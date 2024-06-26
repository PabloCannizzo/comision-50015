const UserModel = require("../dao/models/user.model.js");
const CartModel = require("../dao/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const CustomError = require("../service/errors/custom-errors.js");
const { generarInfoError } = require("../service/errors/info.js");
const { EErrors } = require("../service/errors/enums.js");
const { generateResetToken } = require("../utils/tokenreset.js");
const MailController = require("../service/connections/email.js");
const mailController = new MailController();
const answer = require("../utils/reusable.js");
const UserRepository = require("../repositories/userRepository.js");
const userRepository = new UserRepository();
const upload = require("../middleware/multer.js");
const swal = require("sweetalert");

class UserController {
    async register(req, res) {
        const { first_name, last_name, email, password, age } = req.body;
        try {
            const existeUsuario = await UserModel.find({ first_name, last_name, email });
            if (!existeUsuario) {
                req.logger.error(`Error al intentar crear el usuario - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                throw CustomError.crearError({
                    nombre: "Usuario ya existente",
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

            req.logger.info(`Nuevo usuario creado - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

            const token = jwt.sign({ user: nuevoUsuario }, "coderhouse", {
                expiresIn: "1h"
            });

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");

        } catch (error) {
            req.logger.error(`Error en el registro - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send("Error interno del servidor");
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const usuarioEncontrado = await UserModel.findOne({ email });

            if (!usuarioEncontrado) {
                req.logger.error(`Usuario no valido - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                throw CustomError.crearError({
                    nombre: "Usuario no encontrado",
                    causa: generarInfoError({ email }),
                    mensaje: "Error de ingreso",
                    codigo: EErrors.TIPO_INVALIDO
                });

                //aplicar el formato de error en los otros controladores e incorporar el req.logger. + "el error"...
                //return res.status(401).send("Usuario no válido");
            }

            const esValido = isValidPassword(password, usuarioEncontrado);
            if (!esValido) {
                req.logger.error(`Contraseña Incorrecta - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                return res.status(401).send("Contraseña incorrecta");
            }

            const token = jwt.sign({ user: usuarioEncontrado }, "coderhouse", {
                expiresIn: "1h"
            });

            usuarioEncontrado.last_connection = new Date();
            await usuarioEncontrado.save();

            res.cookie("coderCookieToken", token, {
                maxAge: 3600000,
                httpOnly: true
            });

            res.redirect("/api/users/profile");
            req.logger.info(`Usuario Ingresado - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

        } catch (error) {
            // console.error(error);
            req.logger.error(`Error interno del servidor! - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send("Error interno del servidor");
        }
    }

    async profile(req, res) {
        try {
            const isPremium = req.user.role === 'premium';
            const userDto = new UserDTO(req.user.first_name, req.user.last_name, req.user.role);
            const isAdmin = req.user.role === 'admin';

            res.render("profile", { user: userDto, isPremium, isAdmin });
        } catch (error) {
            res.status(500).send('Error interno del servidor');
            req.logger.error(`Error en el perfil - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
        }
    }

    async logout(req, res) {
        if (req.user) {
            try {
                req.user.last_connection = new Date();
                await req.user.save();
            } catch (error) {
                console.error(error);
                res.status(500).send("Error interno del servidor");
                req.logger.error(`Error interno del servidor - Logout del usuario - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                return;
            }
        }
        res.clearCookie("coderCookieToken");
        req.logger.info(`Logout exitoso del usuario - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

        res.redirect("/login");
    }

    async admin(req, res) {
        if (req.user.user.role !== "admin") {
            return res.status(403).send("Acceso denegado");
        }
        res.render("admin");
    }

    async requestPasswordReset(req, res) {
        const { email } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Generar un token 
            const token = generateResetToken();

            // Guardar el token en el usuario
            user.resetToken = {
                token: token,
                expiresAt: new Date(Date.now() + 3600000) // 1 hora de duración
            };
            await user.save();

            // Enviar correo electrónico con el enlace de restablecimiento utilizando EmailService
            await mailController.enviarCorreoRestablecimiento(email, user.first_name, token);
            
            res.redirect("/confirmation-send");

        } catch (error) {
            req.logger.error(`Error Interno del servidor - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send("Error interno del servidor");
        }
    }

    async resetPassword(req, res) {
        const { email, password, token } = req.body;

        try {
            // Buscar al usuario por su correo electrónico
            const user = await UserModel.findOne({ email });
            if (!user) {
                return res.render("passwordchange", { error: "Usuario no encontrado" });
            }

            // Obtener el token de restablecimiento de la contraseña del usuario
            const resetToken = user.resetToken;
            if (!resetToken || resetToken.token !== token) {
                return res.render("passwordreset", { error: "El token de restablecimiento de contraseña es inválido" });
            }

            // Verificar si el token ha expirado
            const now = new Date();
            if (now > resetToken.expiresAt) {
                // Redirigir a la página de generación de nuevo correo de restablecimiento
                return res.redirect("/passwordchange");
            }

            // Verificar si la nueva contraseña es igual a la anterior
            if (isValidPassword(password, user)) {
                return res.render("passwordchange", { error: "La nueva contraseña no puede ser igual a la anterior" });
            }

            // Actualizar la contraseña del usuario
            user.password = createHash(password);
            user.resetToken = undefined; // Marcar el token como utilizado
            await user.save();

            // Renderizar la vista de confirmación de cambio de contraseña
            return res.redirect("/login");
        } catch (error) {
            console.error(error);
            return res.status(500).render("passwordreset", { error: "Error interno del servidor" });
        }
    }

    async cambiarRolPremium(req, res) {
        try {
            const { uid } = req.params;

            const user = await UserModel.findById(uid);

            const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
            const userDocuments = user.documents.map(doc => doc.name);

            const hasRequiredDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

            if (!hasRequiredDocuments) {
                return res.status(400).json({ message: 'El usuario debe cargar los siguientes documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta' });
                // req.logger.error(`Error Interno del servidor - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            }

            const nuevoRol = user.role === "usuario" ? "premium" : "usuario";

            // const actualizado = await UserModel.findByIdAndUpdate(uid, { role: nuevoRol }, { new: true });
            const actualizado = await userRepository.updateUserRole(uid, nuevoRol);
            res.json(actualizado);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    async documents(req, res) {
        const { uid } = req.params;
        const uploadedDocuments = req.files;

        try {
            const user = await userRepository.findById(uid);

            if (!user) {
                return res.status(404).send("Usuario no encontrado");
            }

            // Verificar si se subieron documentos y actualizar el usuario
            if (uploadedDocuments) {
                if (uploadedDocuments.document) {
                    user.documents = user.documents.concat(uploadedDocuments.document.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
                if (uploadedDocuments.products) {
                    user.documents = user.documents.concat(uploadedDocuments.products.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
                if (uploadedDocuments.profile) {
                    user.documents = user.documents.concat(uploadedDocuments.profile.map(doc => ({
                        name: doc.originalname,
                        reference: doc.path
                    })));
                }
            }

            // Guardar los cambios en la base de datos
            await user.save();

            res.status(200).send("Documentos subidos exitosamente");
        } catch (error) {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        }
    }
}


module.exports = UserController;