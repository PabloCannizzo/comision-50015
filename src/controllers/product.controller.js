const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const answer = require("../utils/reusable.js");

class ProductController {
    async addProduct(req, res) {
        const newProducto = req.body;
        try {
            const result = await productRepository.addProduct(newProducto);
            res.json(result);

        } catch (error) {
            answer(res, 500, "Error" );
        }
    }

    async getProducts(req, res) {
        try {
            let { limit = 10, page = 1, sort, query } = req.query;

            const products = await productRepository.getProductos(limit, page, sort, query);

            res.json(products);
        } catch (error) {
            answer(res, 500, "Error" );
        }
    }

    async getProductsById(req, res) {
        let pid = req.params.pid;
        try {
            const buscado = await productRepository.getProductById(pid); // id

            if (buscado) {
                //return res.json(buscado);
                return answer(res, 201, buscado);
            } else {
                return res.json("ID de producto incorrecto");
            }
        } catch (error) {
            console.log(error);
            //res.status(404).json({ status: "error", message: "Error al buscar el producto" });
            answer(res, 500, "Error al buscar el producto");
        }
    }

    async updateProducts(req, res) {
        const productId = req.params.pid;
        const updatedProduct = req.body;
        try {
            const result = await productRepository.updateProduct(productId, updatedProduct);
            //res.json({ status: "success", message: "Producto actualizado con éxito" });
            console.log("Producto actualizado con éxito");
            res.json(result);
            answer(res, 201, "Producto actualizado con exito");

        } catch (error) {
            console.error("Error al actualizar el producto", error);
            //res.status(404).json({ status: "error", message: "Error al actualizar el producto" });
            answer(res, 500, "Error al actualizar el producto");
        }
    }

    async deleteProducts(res, req) {
        const productId = req.params.pid;
        try {
            if (productId) {
                await productRepository.deleteProduct(productId);
                //res.json({ status: "success", message: "Producto eliminado con éxito" });

                answer(res, 201, "Producto eliminado con éxito");

                const products = await productRepository.getProducts();
                //res.send(products);

                answer(res, 201, products)
            }
            return console.log("Producto eliminado con éxito");
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            //res.status(404).json({ status: "error", message: "Error al eliminar el producto" });

            answer(res, 500, "Error al eliminar el producto");
        }
    }
}

module.exports = ProductController;