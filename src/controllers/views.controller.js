const ProductModel = require("../dao/models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const answer = require("../utils/reusable.js");

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 4 } = req.query;

            const skip = (page - 1) * limit;

            const productos = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const nuevoArray = productos.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });


            const cartId = req.user.cart.toString();

            res.render("products", {
                productos: nuevoArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            req.logger.error(`Error al obtener productos - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            answer(res, 500, "Error interno del servidor");
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const carrito = await cartRepository.obtenerProductosDeCarrito(cartId);

            if (!carrito) {
                req.logger.error("No existe ese carrito con el id");
                return answer(res, 404, "Carrito no encontrado");
            }


            let totalCompra = 0;

            const productosEnCarrito = carrito.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;


                totalCompra += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
                };
            });

            res.render("carts", { productos: productosEnCarrito, totalCompra, cartId });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            answer(res, 500, { error: "Error interno del servidor" });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        const usuario = req.user;
        try {
            res.render("realtimeproducts", { role: usuario.role, email: usuario.email });
        } catch (error) {
            req.logger.error(`Error en la vista RealTime - Method: ${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    async renderResetPassword(req, res) {
        res.render("passwordreset");
    }

    async renderCambioPassword(req, res) {
        res.render("passwordchange");
    }

    async renderConfirmacion(req, res) {
        res.render("confirmation-send");
    }

    async renderPremium(req, res) {
        res.render("panel-premium");
    }
}

module.exports = ViewsController;