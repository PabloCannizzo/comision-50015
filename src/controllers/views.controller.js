const ProductModel = require("../dao/models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();
const answer = require("../utils/reusable.js");

class ViewController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 3 } = req.query;
            const skip = (page - 1) * limit;
            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            const nuevoArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest }; // Agregar el ID al objeto
            });

            const cartId = req.user.cart.toString();
            console.log(cartId);

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
            /* res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            }); */
            answer(res, 500, "Error interno del servidor");
        }
    }

    async renderCarts(req, res) {
        const cartId = req.params.cid;

        try {
            const carrito = await cartRepository.getCarritoById(cartId);

            if (!carrito) {
                console.log("No existe ese carrito con el id");
                //return res.status(404).json({ error: "Carrito no encontrado" });
                return answer(res, 404, "Carrito no encontrado");
            }

            const productosEnCarrito = carrito.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));


            res.render("carts", { products: productosEnCarrito });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    //Ruta para el formulario de login
    async renderlogin(req, res) {
        res.render("login");
        //return res.redirect("/profile");
    }

    // Ruta para el formulario de registro
    async renderRegister(req, res) {
        //return res.redirect("/profile");
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts");
        } catch (error) {
            console.log("error en la vista real time", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }
}

module.exports = ViewController;