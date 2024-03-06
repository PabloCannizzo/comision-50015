// Instalamos: npm i passport passport-local

// Importamos los modulos
const passport = require("passport");
const local = require("passport-local");

//traemos el UserModel y las funciones de bcrypt

const UserModel = require("../dao/models/user.model.js");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({
        passReqToCallback: true,
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {

            //verificamos si ya existe un registro con ese email.

            let user = await UserModel.findOne({ email });
            if(user) return done(null, false);

            // si no existe, voy a crear un registro de usuario nuevo.

            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            let result = await UserModel.create(newUser);

            //si todo resulta bien, podemos mandar done con el usuario genrado.

            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    //Agregamos otra estrategia, ahora para el "login":

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await UserModel.findOne({ email });
            if(!user) {
                console.log(("Este usuario no existe"));
                return done(null, false);
            }

            // Si existe verifico la contraseña.

            if(!isValidPassword(password, user)) return done(null, false);
            return done(null, user);

        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        let user = await UserModel.findById({_id: id});
        done(null, user);
    });
}

module.exports = initializePassport;