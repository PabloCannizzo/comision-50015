class ProductManager {
    static ultId = 0;
    //variable estatica
    constructor () {
        this.products = [];
    }
    addProduct (title, description, price, img, code, stock) {

        if (!title || !description || !price || !img || !code || !stock){
            console.log("Todos los campos son obligatorios, completalo o moriras en 24 hs");
            return;
        }
        if(this.products.some(item => item.code === code)){
            console.log("EL CODIGO DEBE SER UNICO, RATA DE 2 PATAS!");
            return;
        }

        const newProduct = {
            id : ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }
        this.products.push(newProduct);
    }
    getProducts () {
        console.log(this.products);
    }
    getProductById (id){
        const product = this.products.find(item => item.id === id)

        if(!product){
            console.log("Producto no encontrado, moriras miserables!!");
        }
        else{
            console.log("siiiii, lo encontramos. Majestuoso", product);
        }
        return product;
    }
}

const manager = new ProductManager();
manager.getProducts();


/* title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25 */

manager.addProduct("producto prueba", "Este es el prodcuto prueba", 200, "sin imagen", "abc123", 25);
manager.addProduct("Rompecabezas", "Hasbro", 450, "sin imagen", "abc124", 10);
manager.addProduct("Estanciero", "Toys", 200, "sin imagen", "abc125", 40);
manager.addProduct("Puzzle", "toys", 750, "sin imagen", "abc126", 60);

manager.getProducts();

manager.addProduct("Puzzle", "toys", 750, "sin imagen", "abc126", 60);

manager.getProductById(2);
manager.getProductById(50);