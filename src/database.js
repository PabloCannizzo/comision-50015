// conexion con mongooose
/* const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Conexión a MongoDB exitosa!"))
    .catch(() => console.log("Conexión fallida. Ocurrio un error!")); */


//mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority
//mongodb://localhost:27017/coderest


//////////// PATRON DE DISEÑO SINGLETON //////////////
// Es un patron utilizado para tener instancia global a nivel aplicacion.
// En ocasiones, se requiere que la aplicacion tenga una unica instancia de dicha clase ( Por Ejemplo, al abrir una conexion en base de datos).
// El patron singleton corrobora si ya existe una instancia de esta clase. En caso de que si, devolverá la instancia, caso contrario creará la instancia.

const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const {mongo_url} = configObject;

class BaseDatos {
    static #instancia;

    // Se declara una variable estatica y privada #instacia. La palabra clave static significa que esta variable pertenece a la clase en si, no a las instancias individuales de la clase.

    constructor(){
        mongoose.connect(mongo_url);
    }
    static getInstancia(){
        if(this.#instancia){
            console.log("Conexion previa");
            return this.#instancia;
        }

        this.#instancia = new BaseDatos();
        console.log("Conexion exitosa!");
        return this.#instancia;
    }
}
module.exports = BaseDatos.getInstancia();