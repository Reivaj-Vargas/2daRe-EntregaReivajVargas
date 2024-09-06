let productos = [];

fetch('../database/productos.json') 
    .then(response => response.json())
    .then(data => {
        productos = data;
        actualizarProductos(productos);
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
    });

function actualizarProductos(productos) {
    const productosDiv = document.getElementById('productosDiv'); 
    productosDiv.innerHTML = '';

    productos.forEach((producto, index) => {
        const productoCard = document.createElement('div');
        productoCard.className = 'col-md-4 mb-4';
        productoCard.innerHTML = `
            <div class="card h-100">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">Precio: $${producto.precio}</p>
                    <button data-index="${index}" class="btn btn-primary btn-agregar">Agregar al carrito</button>
                </div>
            </div>
        `;
        productosDiv.appendChild(productoCard);
    });

    agregarEventosBotones(productos);
}

function agregarEventosBotones(productos) {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            agregarAlCarrito(index, productos);
        });
    });
}
