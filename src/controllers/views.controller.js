const ProductManager = require("../dao/db/product-manager-db.js");
const CartManager = require("../dao/db/cart-manager-db.js");
const productManager = new ProductManager();
const cartManager = new CartManager();
const answer = require("../utils/reusable.js");

class ViewController {
    async getProducts(req, res) {
        try {
            const { page = 1, limit = 2 } = req.query;
            const productos = await productManager.getProducts({
                page: parseInt(page),
                limit: parseInt(limit)
            });

            const nuevoArray = productos.docs.map(producto => {
                const { _id, ...rest } = producto.toObject();
                return rest;
            });

            res.render("products", {
                productos: nuevoArray,
                hasPrevPage: productos.hasPrevPage,
                hasNextPage: productos.hasNextPage,
                prevPage: productos.prevPage,
                nextPage: productos.nextPage,
                currentPage: productos.page,
                totalPages: productos.totalPages,
                //user: req.session.user
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

    async getCarts(req, res) {
        const cartId = req.params.cid;

        try {
            const carrito = await cartManager.getCarritoById(cartId);

            if (!carrito) {
                console.log("No existe ese carrito con el id");
                //return res.status(404).json({ error: "Carrito no encontrado" });
                return answer(res, 500, "Carrito no encontrado");
            }

            const productosEnCarrito = carrito.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));


            res.render("carts", { productos: productosEnCarrito });
        } catch (error) {
            console.error("Error al obtener el carrito", error);
            //res.status(500).json({ error: "Error interno del servidor" });
            answer(res, 500, "Error interno del servidor");
        }
    }

    //Ruta para el formulario de login
    async login(req, res) {
        // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así

        /// COMENTADO 16/03/24 para implementar JWT
        if (req.session.login) {
            return res.redirect("/profile");
        }

        res.render("login");
    }

    // Ruta para el formulario de registro
    async register(req, res) {
        // Verifica si el usuario ya está logueado y redirige a la página de perfil si es así

        // COMENTADO 16/03/24
        if (req.session.login) {
            return res.redirect("/profile");
        }
        res.render("register");
    }

    // Ruta para la vista de perfil 
    async profile(req, res) {
        // Verifica si el usuario está logueado

        /// COMENTADO 16/03/24
        if (!req.session.login) {
            // Redirige al formulario de login si no está logueado
            return res.redirect("/login");
        }
        // Renderiza la vista de perfil con los datos del usuario
        res.render("profile", { user: req.session.user });

        //res.render("/profile");
    }
}

module.exports = ViewController;