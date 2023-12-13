const fs = require("fs").promises;

class ProductManager {
    static ultId = 0;
    //variable estatica
    constructor(path) {
        this.products = [];
        this.path = path;
    }
    async addProduct(nuevoObjeto) {
        let { title, description, price, img, code, stock } = nuevoObjeto;

        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios, completalo o moriras en 24 hs");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("EL CODIGO DEBE SER UNICO, RATA DE 2 PATAS!");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }
        this.products.push(newProduct);

        await this.guardarArchivo(this.products);

    }
    getProducts() {
        console.log(this.products);
    }
    async getProductById(id) {
        //const product = this.products.find(item => item.id === id)

        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);

            if (!buscado) {
                console.log("Producto no encontrado");
            }
            else {
                console.log("siiiii, lo encontramos. Majestuoso");
                return buscado;
            }
        } catch (error) {
            console.log(("Error al leer el archivo", error));
        }

    }
    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;

        } catch (error) {
            console.log("Erro al leer archivo", error);
        }
    }
    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }
    async updateProduct(id, productoActualizado) {
        try {
            const arrayProductos = await this.leerArchivo();
            const index = arrayProductos.findIndex(item => item.id === id);

            if (index !== -1) {
                arrayProductos.splice(index, 1, productoActualizado);
                await this.guardarArchivo(arrayProductos);
            } else {
                console.log("no se encontró el producto");
            }
        } catch (error) {
            console.log("Error al actualizar el producto", error);
        }
    }
    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const newArray = arrayProductos.filter(item => item.id !== id);
            await this.guardarArchivo(newArray);
            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.log("Error al borrar el producto. Producto no encontrado :(");
        }
    }
}

// Testing: 
const manager = new ProductManager("./productos.json");

manager.getProducts();

const rompecabezas = {
    title: "Rompecabezas",
    description: "Hasbro",
    price: 450,
    img: "sin imagen",
    code: "abc124",
    stock: 10
}

manager.addProduct(rompecabezas);

const estanciero = {
    title: "Estanciero",
    description: "Toys",
    price: 200,
    img: "sin imagen",
    code: "abc125",
    stock: 40
}

manager.addProduct(estanciero);

const puzzle = {
    title: "Puzzle",
    description: "toys",
    price: 750,
    img: "sin imagen",
    code: "abc126",
    stock: 60
}
manager.addProduct(puzzle);

const bloques = {
    title: "Bloques",
    description: "Juegos",
    price: 7500,
    img: "sin imagen",
    code: "abc127",
    //stock: 60
}
//manager.addProduct(bloques);

manager.getProducts();

async function testeamosBusquedaPorId() {
    const buscado = await manager.getProductById(1);
    console.log(buscado);
}

//testeamosBusquedaPorId();

const didactico = {
    id: 1,
    title: "Juegos Didacticos",
    description: "Aprender",
    price: 7550,
    img: "Sin imagen",
    code: "abc124",
    stock: 25
};

async function testeamosActualizar() {
    await manager.updateProduct(1, didactico);
}

//testeamosActualizar();

async function testeamosBorrar() {
    await manager.deleteProduct(1);
}
testeamosBorrar();