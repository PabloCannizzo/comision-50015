// conexion con mongooose
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexión a MongoDB exitosa!"))
    .catch(() => console.log("Conexión fallida. Ocurrio un error!"));


//mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority
//mongodb://localhost:27017/coderest