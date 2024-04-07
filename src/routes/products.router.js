const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productController = new ProductController();

/* const ProductManager = require("../dao/db/product-manager-db.js");
const productManager = new ProductManager();


router.get("/", async (req, res) => {
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
        res.status(500).json({
            error: "Error en el servidor"
        });
    }
})


router.post("/", async (req, res) => {
    const { title, description, price, img, code, stock, category } = req.body;
    try {
        await productManager.addProduct({ title, description, price, img, code, stock, category });
        res.json({ status: "success", message: "Producto agregado con éxito" });
    } catch (error) {
        console.error("Producto no creado", error);
        res.status(404).json({ status: "error", message: "Error al crear el producto" });
    }
});

router.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    try {
        const buscado = await productManager.getProductById(pid); // id

        if (buscado) {
            return res.json(buscado);
        } else {
            return res.json("ID de producto incorrecto");
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: "error", message: "Error al buscar el producto" });
    }
})

router.put("/:pid", async (req, res) => {
    const productId = req.params.pid;
    const updatedProduct = req.body;
    try {
        await productManager.updateProduct(productId, updatedProduct);
        res.json({ status: "success", message: "Producto actualizado con éxito" });
        console.log("Producto actualizado con éxito");
    } catch (error) {
        console.error("Error al actualizar el producto", error);
        res.status(404).json({ status: "error", message: "Error al actualizar el producto" });
    }
});

router.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;
    try {
        if (productId) {
            await productManager.deleteProduct(productId);
            res.json({ status: "success", message: "Producto eliminado con éxito" });
            const products = await productManager.getProducts();
            res.send(products);
        }
        return console.log("Producto eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el producto", error);
        res.status(404).json({ status: "error", message: "Error al eliminar el producto" });
    }
}); */

router.get("/", productController.getProducts);
router.post("/", productController.postProducts);
router.get("/:pid", productController.getProductsById);
router.put("/:pid", productController.updateProducts);
router.delete("/:pid", productController.deleteProducts);

module.exports = router; 

// NOTA: CAMBIAR UBICACION DE RUTAS A CONTROLLER, GUIANDOME DE LOS REPOSITORIOS DEL PROFESOR, CLASE N°27. ASU VEZ APLICAR CON METODO JWT