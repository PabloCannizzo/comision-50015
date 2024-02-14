const socket = io();
console.log("Bienvenido Usuario");

socket.on("productos", (data) => {
    renderProductos(data);
});

const renderProductos = (productos) => {
    const contenedorProductos = document.getElementById("contenedorProductos");
    contenedorProductos.innerHTML = "";
    productos.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <p>Id: ${item.id} </p>
            <p>Titulo: ${item.title} </p>
            <p>Description: ${item.description} </p>
            <p>Precio: $${item.price} </p>
            <p>stock: ${item.stock} </p>
            <button id="btnAgregar"> Agregar Producto </button>
        `;
    });
}

const eliminarProducto = (id) => {
    socket.emit("eliminarProducto", id);
}

document.getElementById("btnAgregar").addEventListener("click", () => {
    agregarProducto();
});

const agregarProducto = () => {
    socket.emit("agregarProducto", producto);
};

socket.on("productos", (data) => {
    renderProductos(data);
});

