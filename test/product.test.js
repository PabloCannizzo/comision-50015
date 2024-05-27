const assert = require("assert");
const mongoose = require("mongoose");
// Modulo nativo de Node JS que nos permite hacer las validaciones

const ProductController = require("../src/controllers/product.controller.js");

//Me conecto a mi base de datos
mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority");

// Describe es una funcion que me permite agrupar un conjunto de pruebas relacionadas bajo un mismo bloque descriptivo.

describe("Testeamos el DAO de Productos", function () {
    //Le asignamos un nombre o titulo
    //Pasamos una funcion callback que contiene todas las pruebas individuales.

    // Esto se ejecuta una vez antes de las pruebas.
    before(function () {
        this.product = new ProductController();
    })

    //Limpiamos la BD cada vez que testeamos: 
    beforeEach(async function () {
        await mongoose.connection.collections.product.drop();
        //this.timeout(5000);
    })
    //Acá le estamos pidiendo que borre la collections "product". 
    //Además le da un tiempo máximo para completar la operacion en 5 segundos. 

    //Intentamso que nos retorne todos los productos
    //En el "it" describimos lo que se espera del test.
    it("El get de productos me debe retornar un array", async function() {
        const resultado = await this.product.getProducts();
        assert.strictEqual(Array.isArray(resultado), true);
        //Array.isArray(resultado) me retorna true si el dato pasado es un array.
        //assert.stricEqual compara los valores "===".
    })
    
    after(async function() {
        await mongoose.disconnect();
    })
})