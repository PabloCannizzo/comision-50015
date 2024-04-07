const CartManager = require("../dao/db/cart-manager-db.js");
const cartManager = new CartManager("./src/models/carrito.json");
const CartModel = require("../dao/models/cart.model.js");
const answer = require("../utils/reusable.js");


class CartsController {
    async createCarts(req, res) {
        try {
            const nuevoCarrito = await cartManager.crearCarrito();
            console.log("Carrito creado exitosamente");
            res.json(nuevoCarrito)
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async getCarts(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await CartModel.findById(cartId)

            if (!carrito) {
                console.log("No existe ese carrito con el id");
                //return res.status(404).json({ error: "Carrito no encontrado" });
                return answer(res, 404, "Carrito no encontrado");
            }
            return res.json(carrito.products);
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async addProductsInCarts(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            const actualizarCarrito = await cartManager.agregarProductoAlCarrito(cartId, productId, quantity);
            res.json(actualizarCarrito.products);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async deleteProductsCarts(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const updatedCart = await cartManager.eliminarProductoDelCarrito(cartId, productId);

            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al eliminar el producto del carrito', error);
            /* res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            }); */
            answer(res, 500, "Error interno del servidor");
        }
    }

    async updateCarts(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;

        try {
            const updatedCart = await cartManager.actualizarCarrito(cartId, updatedProducts);
            res.json(updatedCart);
        } catch (error) {
            console.error('Error al actualizar el carrito', error);
            /* res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            }); */
            answer(res, 500, "Error interno del servidor");

        }
    }

    async updateProductsCarts(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const newQuantity = req.body.quantity;

            const updatedCart = await cartManager.actualizarCantidadDeProducto(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto en el carrito', error);
            /* res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            }); */
            answer(res, 500, "Error interno del servidor");
        }
    }

    async deleteCarts(req, res) {
        try {
            const cartId = req.params.cid;

            const updatedCart = await cartManager.vaciarCarrito(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });
        } catch (error) {
            console.error('Error al vaciar el carrito', error);
            /* res.status(500).json({
                status: 'error',
                error: 'Error interno del servidor',
            }); */
            answer(res, 500, "Error interno del servidor");
        }
    }
}

module.exports = CartsController;