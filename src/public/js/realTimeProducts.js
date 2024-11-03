const socket = io();

function mostrarProductos(productos) {
    const listaProductos = document.getElementById('listaProductos');
    listaProductos.innerHTML = '';  // Limpiar la lista actual

    // Renderizar cada producto como un elemento de lista
    productos.forEach(producto => {
        const productoItem = document.createElement('li');
        productoItem.textContent = `${producto.title} | Precio: $${producto.price}`;
        productoItem.dataset.id = producto.id;
        listaProductos.appendChild(productoItem);
    });
}

// Escuchar el evento 'mostrarProductos' del servidor
socket.on('productoActualizado', (productosActualizados) => {
    mostrarProductos(productosActualizados);
});