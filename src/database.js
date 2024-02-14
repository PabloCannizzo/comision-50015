// conexion con mongooose
const mongoose = require("mongoose");
const ProductModel = require("./dao/models/product.model");

const main = async () => {
    mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => console.log("Conexión a MongoDB exitosa!"))
    .catch(() => console.log("Conexión fallida. Ocurrio un error!"));

    //const resultado = await ProductModel.paginate({"stock":20}, {limit: 10, page: 7});
    //console.log(resultado);
}
main();


    //mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority
    //mongodb://localhost:27017/coderest