// conexion con mongooose
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexion exitosa!"))
    .catch(() => console.log("Ocurrio un error!"));