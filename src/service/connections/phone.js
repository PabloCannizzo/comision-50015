const twilio = require("twilio");
const TWILIO_ACCOUNT_SID = "AC3620afac080c7fd088f0ff4351d0e33a";
const TWILIO_AUTH_TOKEN = "717f3e85fe9b0438c208726180ec4791";
const TWILIO_SMS_NUMBER = "+19382014048";

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SMS_NUMBER);

class ContactController {
    async getSms(req, res, first_name, ticket) {
        await client.messages.create({
            from: TWILIO_SMS_NUMBER,
            to: "+543813321480",
            body: `
            <h1>Confirmación de compra</h1>
            <p>Gracias por tu compra, ${first_name}!</p>
            <p>El número de tu orden es: ${ticket}</p>
        `
        })

        req.logger.info(`Mensaje enviado correctamente - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)

        // res.send("SMS enviado!");
    }
}

module.exports = ContactController;