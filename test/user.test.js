import mongoose from "mongoose";
import assert from "assert"; 
import UserController from "../src/controllers/user.controller.js";

//Me conecto a mi Base de Datos. 
mongoose.connect("mongodb+srv://PabloCannizzo:mpc1451<@cluster0.v9gw0ln.mongodb.net/ecommerce?retryWrites=true&w=majority");

//Describe: es una función que me permite agrupar un conjunto de pruebas relacionadas bajo un mismo bloque descriptivo. 

describe("Testeamos el DAO de Usuarios", function () {
    //Le asignamos un nombre o titulo
    //Pasamos una funcion callback que contiene todas las pruebas individuales. 

    //Esto se ejecuta una vez, antes de las pruebas. 
    before(function () {
        this.users = new UserController(); 
    })

    beforeEach(async function () {
        await mongoose.connection.collections.users.drop();
        //this.timeout(5000);
    })
    

    it("El get de usuarios me debe retornar un array", async function() {
        const resultado = await this.users.get();
        assert.strictEqual(Array.isArray(resultado), true);
        //Array.isArray(resultado) me retorna true si el dato pasado es un array. 
        //assert.strictEqual compara los valores "===". 
    })

    //Test 1: 
    it("El DAO debe poder agregar un usuario nuevo a la Base de datos", async function() {
        let usuario = {
            first_name: "Diego",
            last_name: "Maradona", 
            email: "diego@maradona.com",
            password: "1234"
        }

        const resultado = await this.users.save(usuario);
        assert.ok(resultado._id);
        //Acá verificamos que el valor que recibimos es "verdadero". 

    })

    //Test 2: 
    it("Validamos que el usuario tenga un array de mascotas vacio", async function() {
        let usuario = {
            first_name: "Diego",
            last_name: "Maradona", 
            email: "diego@maradona.com",
            password: "1234"
        }

        const resultado = await this.users.save(usuario); 
        assert.deepStrictEqual(resultado.pets, []);
    })

    //Test 3: 
    it("El DAO puede obtener un usuario por email", async function() {
        let usuario = {
            first_name: "Diego",
            last_name: "Maradona", 
            email: "diego@maradona.com",
            password: "1234"
        }
        await this.users.save(usuario); 

        const user = await this.users.login({email: usuario.email}); 

        assert.strictEqual(typeof user, "object");
    })

    after(async function() {
        await mongoose.disconnect(); 
    })

})