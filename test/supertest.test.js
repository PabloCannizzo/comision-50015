//Testing de integracion: analizara toda nuestra app en su conjunto.
//Testing funcional: este evalua el comportamiento completo del sistema pero desde la vision del usuario.
//importamos supertest:

const supertest = require("supertest");

//importamos chai, recuerden que es una libreria de aserciones para node js.
const chai = require("chai");
const expect = chai.expect;

const requester = supertest("http://localhost:8080"); 

describe("Testing de la APP E-commerce", () => {
    //1) Productos:
    describe("Testing de productos: ", () => {
        it("Endpoint POST /api/products me debe agregar los productos", async () => {

            const productMock = {
                title: "Herramientas KIDS",
                description: "Toys",
                price: 9000,
                img: "sin imagen",
                code: "77aa8",
                stock: 10,
                category: "Juegos Didacticos"
            }

            const { statusCode, ok, _body} = await requester.post("/api/products").send(productMock);

            console.log(statusCode);
            console.log(ok);
            console.log(_body);

            //Podemos evaluar si el payload tiene una propiedad id, si lo tiene se pudo crear correctamente el documento del producto.

            expect(_body.payload).to.have.property("_id");
        })
    })
})