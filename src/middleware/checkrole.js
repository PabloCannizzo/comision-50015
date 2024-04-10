const jwt = require('jsonwebtoken');
const Answer = require('../utils/reusable');

const checkUserRole = (allowedRoles) => (req, res, next) => {
    const token = req.cookies.coderCookieToken;

    if (token) {
        jwt.verify(token, "coderhouse", (err, decoded) => {
            if (err) {
                Answer(res, 403, "Acceso denegado. Token inválido.")
            } else {
                const userRole = decoded.user.role;
                if (allowedRoles.includes(userRole)) {
                    next();
                } else {
                    Answer(res, 403, "Acceso denegado. No tienes permiso para acceder a esta página.")
                }
            }
        });
    } else {
        Answer(res, 403, "Acceso denegado. Token no proporcionado.");
    }
};

module.exports = checkUserRole;