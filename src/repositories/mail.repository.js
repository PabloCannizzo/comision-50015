/* const nodemailer = require("nodemailer");
const answer = require("../utils/reusable.js")

class MailRepository {
    static nodemailer (req, res) {
        try {
            const transport = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                auth: {
                    user: "pablocannizzo@gmail.com",
                    pass: "ranb ckyk fsfa jjcg"
                }
            });
        } catch (error) {
            answer(res, 500, "Error al adquirir los datos");
        }
    }
}

module.exports = MailRepository; */
