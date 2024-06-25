const nodemailer = require("nodemailer");
const answer = require("../../utils/reusable.js")

class MailController {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            port: 587,
            auth: {
                user: "pablocannizzo@gmail.com",
                pass: "ranb ckyk fsfa jjcg"
            }
        });
    }
    async enviarCorreoCompra(email, first_name, ticket, req, res) {
        try {
            const mailOptions = {
                from: "Coder Test / E-commerce <pablocannizzo@gmail.com>",
                to: email,
                subject: "Confirmación de compra",
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);

            req.logger.info(`Email enviado correctamente - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)

        } catch (error) {
            req.logger.error(`Error al enviar el email - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
        }
    }

    async enviarCorreoRestablecimiento(email, first_name, token, req, res) {
        try {
            const mailOptions = {
                from: 'pablocannizzo@gmail.com',
                to: email,
                subject: "Restablecimiento de Contraseña",
                html: `
                    <h1>Restablecimiento de Contraseña</h1>
                    <p>Hola ${first_name},</p>
                    <p>Has solicitado restablecer tu contraseña. Utiliza el siguiente código para cambiar tu contraseña:</p>
                    <p><strong>${token}</strong></p>
                    <p>Este código expirará en 1 hora.</p>
                    <a href="https://backend-2024.up.railway.app/password">Restablecer Contraseña</a>
                    <p>Si no solicitaste este restablecimiento, ignora este correo.</p>
                `
            };

            await this.transporter.sendMail(mailOptions);

            req.logger.warning(`Mensaje de restablecimiento de contraseña, enviado! - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
            
        } catch (error) {
            throw new Error("Error al enviar correo electrónico");
        }
    }
}

module.exports = MailController;