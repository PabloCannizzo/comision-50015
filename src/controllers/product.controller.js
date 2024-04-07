const ProductModel = require("../dao/models/product.model.js");
const answer = require("../utils/reusable.js");
const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();

class ProductController {
    async getProducts(req, res) {
        try {
            const { limit = 10, page = 1, sort, query } = req.query;

            const productos = await productManager.getProducts({
                limit: parseInt(limit),
                page: parseInt(page),
                sort,
                query,
            });
            res.json({
                status: 'success',
                payload: productos,
                totalPages: productos.totalPages,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                page: productos.page,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
                nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
            });
        } catch (error) {
            console.log("Error al cargar el producto", error);
            answer(res, 500, "Error en el servidor");
        }
    }

    async postProducts(req, res) {
        const { title, description, price, img, code, stock, category } = req.body;
        try {
            await productManager.addProduct({ title, description, price, img, code, stock, category });
            //res.json({ status: "success", message: "Producto agregado con éxito" });
            answer(res, 201, "Producto agregado con exito");

        } catch (error) {
            console.error("Producto no creado", error);
            //res.status(404).json({ status: "error", message: "Error al crear el producto" });
            answer(res, 500, "Error al crear el producto");
        }
    }

    async getProductsById(req, res) {
        let pid = req.params.pid;
        try {
            const buscado = await productManager.getProductById(pid); // id

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
            await productManager.updateProduct(productId, updatedProduct);
            //res.json({ status: "success", message: "Producto actualizado con éxito" });
            console.log("Producto actualizado con éxito");

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
                await productManager.deleteProduct(productId);
                //res.json({ status: "success", message: "Producto eliminado con éxito" });

                answer(res, 201, "Producto eliminado con éxito");

                const products = await productManager.getProducts();
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