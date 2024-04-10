const passport = require("passport");
const jwt = require("passport-jwt");
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;
const UserModel = require("../dao/models/user.model.js");

//Passport con GitHub
const GitHubStrategy = require("passport-github2");

const initializePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Utiliza ExtractJwt.fromExtractors para extraer el token de la cookie
        secretOrKey: "coderhouse"
    }, async (jwt_payload, done) => {
        try {
            // Busca el usuario en la base de datos usando el ID del payload JWT
            const user = await UserModel.findById(jwt_payload.user._id);
            if (!user) {
                return done(null, false);
            }
            return done(null, user); // Devuelve el usuario encontrado
        } catch (error) {
            return done(error);
        }
    }));
}


const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token;
}

// desarrolamos nueva estrategia con githbu

passport.use("github", new GitHubStrategy({
    clientID: "Iv1.9c5692790d9b6855",
    clientSecret: "90d10ccdbeedae761e4fbfaf215fdfa027332405",
    callbackURL: "http://localhost:8080/api/sessions/githubcallback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Profile:", profile);
    try {
        let user = await UserModel.findOne({ email: profile._json.email })

        if (!user) {
            let newUser = {
                first_name: profile._json.name,
                last_name: "",
                age: 36,
                email: profile._json.email,
                password: "",
                role: profile._json.role
            }
            let result = await UserModel.create(newUser);
            done(null, result);
        } else {
            done(null, user);
        }

    } catch (error) {
        return done(error);
    }
}))


module.exports = initializePassport;