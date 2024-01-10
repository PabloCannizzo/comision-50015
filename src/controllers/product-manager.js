const fs = require("fs").promises;

/* class ProductManager {
    static ultId = 0;
    constructor(path) {
        //this.products = path ? this.leerArchivo() : [];
        this.products = [];
        this.path = path;
    }
    async addProduct(nuevoObjeto) {
        let { title, description, price, img, code, stock, category} = nuevoObjeto;

        if (!title || !description || !price || !img || !code || !stock || !category) {
            console.log("Todos los campos son obligatorios, completalos para continuar");
            return;
        }
        if (this.products.some(item => item.code === code)) {
            console.log("EL CODIGO DEBE SER UNICO");
            return;
        }

        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock,
            category
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
                console.log("Producto Encontrado");
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
} */

class ProductManager {

    constructor(path) {
        this.path = path;
        this.products = this.loadProducts() || [];
        this.nextProductId = 1;
    }

    async init() {
        await this.loadProducts();
    }

    // Método para obtener todos los productos
    async getProducts() {

        if (!this.products || this.products.length === 0) {
            await this.loadProducts();
        }
        return this.products;
    }

    async loadProducts() {
        try {
            if (await fs.stat(this.path)) {
                const data = await fs.readFile(this.path, 'utf8');
                console.log("Productos guardados en el JSON:", data);
                this.products = JSON.parse(data);
                this.nextProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
            }
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log("El archivo no existe. Se iniciará un nuevo arreglo de productos.");
                this.products = [];
            } else {
                throw error;
            }
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (err) {
            console.error("Error al guardar los productos:", err);
        }
    }


    async addProduct({ title, description, code, price, stock, category, thumbnails = [], status = true }) {
        const product = {
            id: this.nextProductId++,
            title,
            description,
            price: Number(price),
            thumbnails,
            code,
            stock: Number(stock),
            status,
            category
        }

        this.products.push(product);
        await this.saveProducts();
        console.log(`El producto ${title} ha sido agregado con éxito.`);
        return { status: 200, msg: `El producto ${title} ha sido agregado con éxito.` };
    }


    async getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            return { error: 'Producto no encontrado' };
        }
    }

    async updateProduct(id, updatedProduct) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = { ...this.products[productIndex], ...updatedProduct, id: id };
            await this.saveProducts();
            console.log(`El producto con id: ${id} ha sido actualizado con éxito.`);
        } else {
            console.log("Error: Producto no encontrado.");
        }
    }

    async deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            await this.saveProducts();
            console.log(`El producto con id: ${id} ha sido eliminado con éxito.`);
        } else {
            console.log("Error: Producto no encontrado.");
        }
    }
}


module.exports = ProductManager;