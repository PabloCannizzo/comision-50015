/* const MailRepository = require("../repositories/mail.repository.js");
const mailRepository = new MailRepository(); */
const nodemailer = require("nodemailer");
const answer = require("../utils/reusable.js")


class MailController {
    //Borrar
    async getMailPlantilla(req, res) {
        try {
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "pablocannizzo@gmail.com",
                    pass: "ranb ckyk fsfa jjcg"
                }
            });

            const emailData = {
                subject: "Correo de prueba",
                body: "Esto es un test!"
            };

            const html = await res.render("mail", emailData);

            await transport.sendMail({
                from: "Coder Test <pablocannizzo@gmail.com>",
                to: "pablo.cuentasp@hotmail.com",
                subject: emailData.subject,
                html
            })

            res.send("Mensaje enviado");
        } catch (error) {
            res.status(500).send("Error al enviar mail!");
        }
    }

    async getMail(req, res) {
        try {
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "pablocannizzo@gmail.com",
                    pass: "ranb ckyk fsfa jjcg"
                }
            });
            await transport.sendMail({
                from: "Coder Test <pablocannizzo@gmail.com>",
                to: "pablo.cuentasp@hotmail.com",
                subject: "Correo de prueba",
                //se puede adjuntar cualquier clase de información para enviar
                html: `<h1>Con imagenes</h1>
                        <img src="cid:Fondo Marcas">`,
                //Para enviar como adjunto: 
                attachments: [{
                    filename: "fondo-marcas.jpg",
                    path: "./src/public/img/fondo-marcas.jpg",
                    cid: "Fondo Marcas"
                }]
            })
            res.send("Correo enviado correctamente");
        } catch (error) {
            res.status(500).send("Error al enviar mail");
        }
    }

    async getContacto(req, res) {
        res.render("contact");
    }

    async postSendMessage(req, res) {
        const { email, mensaje } = req.body;
        try {
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "pablocannizzo@gmail.com",
                    pass: "ranb ckyk fsfa jjcg"
                }
            });
            await transport.sendMail({
                from: "Coder Test <pablocannizzo@gmail.com>",
                to: email,
                subject: "TEST",
                text: mensaje
            })
            res.send("Correo enviado correctamente!");
        } catch (error) {
            res.status(500).send("Error al enviar mail, vas a morir");
        }
    }
}

module.exports = MailController;