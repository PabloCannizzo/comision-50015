const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const TicketModel = require("../dao/models/ticket.model.js");
const answer = require("../utils/reusable.js");
const UserModel = require("../dao/models/user.model.js");
const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const { generateUniqueCode, calcularTotal } = require("../utils/cartUtils.js");



class CartController {
    async nuevoCarrito(req, res) {
        try {
            const nuevoCarrito = await cartRepository.crearCarrito();
            req.logger.info(`Nuevo carrito creado - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.json(nuevoCarrito);
        } catch (error) {
            req.logger.error(`Error al crear el carrito - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).send("Error");
        }
    }

    async obtenerProductosDeCarrito(req, res) {
        const carritoId = req.params.cid;
        try {
            const productos = await cartRepository.obtenerProductosDeCarrito(carritoId);
            if (!productos) {
                req.logger.error(`Error al obtener productos del carrito - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
                return res.status(404).json({ error: "Productos del carrito no encontrados" });
            }
            res.json(productos);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async agregarProductoEnCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity || 1;
        try {
            await cartRepository.agregarProducto(cartId, productId, quantity);
            const carritoID = (req.user.cart).toString();

            req.logger.warning(`Producto del carrito agregado - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

            res.redirect(`/carts/${carritoID}`)
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async eliminarProductoDeCarrito(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const updatedCart = await cartRepository.eliminarProducto(cartId, productId);
            res.json({
                status: 'success',
                message: 'Producto eliminado del carrito correctamente',
                updatedCart,
            });

            req.logger.warning(`Producto eliminado del carrito correctamente - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarProductosEnCarrito(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body;
        
        try {
            const updatedCart = await cartRepository.actualizarProductosEnCarrito(cartId, updatedProducts);
            res.json(updatedCart);

            req.logger.info(`Prodcuto actualizado en el carrito - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
        } catch (error) {
            res.status(500).send("Error");
        }
    }

    async actualizarCantidad(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;
        try {
            const updatedCart = await cartRepository.actualizarCantidadesEnCarrito(cartId, productId, newQuantity);

            res.json({
                status: 'success',
                message: 'Cantidad del producto actualizada correctamente',
                updatedCart,
            });

            req.logger.info(`Cantidad del producto actualizada correctamente - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
        } catch (error) {
            res.status(500).send("Error al actualizar la cantidad de productos");
        }
    }

    async vaciarCarrito(req, res) {
        const cartId = req.params.cid;
        try {
            const updatedCart = await cartRepository.vaciarCarrito(cartId);

            res.json({
                status: 'success',
                message: 'Todos los productos del carrito fueron eliminados correctamente',
                updatedCart,
            });

            req.logger.warning(`Todos los productos del carrito fueron eliminados correctamente - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);

        } catch (error) {
            res.status(500).send("Error");
        }
    }

    //Ultima Pre Entrega: 
    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        try {
            // Obtener el carrito y sus productos
            const cart = await cartRepository.obtenerProductosDeCarrito(cartId);
            const products = cart.products;

            // Inicializar un arreglo para almacenar los productos no disponibles
            const productosNoDisponibles = [];

            // Verificar el stock y actualizar los productos disponibles
            for (const item of products) {
                const productId = item.product;
                const product = await productRepository.obtenerProductoPorId(productId);
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
            req.logger.error(`Error al procesar la compra - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            //console.error('Error al procesar la compra:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }

}

module.exports = CartController;