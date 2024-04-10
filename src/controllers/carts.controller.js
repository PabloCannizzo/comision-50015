const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const TicketModel = require("../dao/models/ticket.model.js");
const answer = require("../utils/reusable.js");
const UserModel = require("../dao/models/user.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartUtils.js");

// CartModel, cartManager
class CartsController {
    async createCarts(req, res) {
        try {
            const newCart = await cartRepository.createCart();
            console.log("Carrito creado exitosamente");
            res.json(newCart)
        } catch (error) {
            console.error("Error al crear un nuevo carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async getCarts(req, res) {
        const cartId = req.params.cid;
        try {
            const products = await cartRepository.getCarts(cartId) //findById

            if (!products) {
                console.log("No existe ese carrito con el id");
                //return res.status(404).json({ error: "Carrito no encontrado" });
                return answer(res, 404, "Carrito no encontrado");
            }
            return res.json(carrito);
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
            const updateCarts = await cartRepository.addProductsInCarts(cartId, productId, quantity);
            res.json(updateCarts);
            const carritoID = (req.user.cart).toString();

            res.redirect(`/carts/${carritoID}`);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async deleteProducts(req, res) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;

            const updatedCart = await cartRepository.deleteProducts(cartId, productId);

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
            const updatedCart = await cartRepository.updateCarts(cartId, updatedProducts);
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

            const updatedCart = await cartRepository.updateProductsCarts(cartId, productId, newQuantity);

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

            const updatedCart = await cartRepository.deleteCarts(cartId);

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

    // Finalizar Compra.
    async finalizePurchase(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartRepository.getCarts(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.getProductById(productId);
                if (product.stock >= item.quantity) {
                    // Si hay suficiente stock, restar la cantidad del producto
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    // Si no hay suficiente stock, agregar el ID del producto al arreglo de no disponibles
                    productosNoDisponibles.push(productId);
                }
            }

            const userWithCart = await UserModel.findOne({ cart: cartId });

            // Crear un ticket con los datos de la compra
            const ticket = new TicketModel({
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: calcularTotal(cart.products),
                purchaser: userWithCart._id
            });
            await ticket.save();

            // Eliminar del carrito los productos que sí se compraron
            cart.products = cart.products.filter(item => productosNoDisponibles.some(productId => productId.equals(item.product)));

            // Guardar el carrito actualizado en la base de datos
            await cart.save();

            res.status(200).json({ productosNoDisponibles });
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
}

module.exports = CartsController;