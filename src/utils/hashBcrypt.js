// Bcrypt es un alibreria de hashing de contraseñas.
//1) Instalamos: npm install bcrypt
//2) Importamos el modulo:

const bcrypt = require("bcrypt");

//3)se crearan 2 funciones:
//a) createHash: aplicar el hash al password.
//b) isValidPassword: comparar el password proporcionado por la base de datos.

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// hashSync: toma el password que le pasamos y aplica el proceso de hasheo a partir de un salt.

// Un "salt" es un string random que hace que el proceso de hasheo se realice de forma impredecible.

// genSaltSync(10): generara un salt de 10 caracteres.
// ESTE PREOCESO ES IRREVESRIBLE!!!!

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

// comparar los password, retorna true o false segun corresponda.

module.exports = {
    createHash,
    isValidPassword
}