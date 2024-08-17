const productos = [
    { nombre: "Espresso", precio: 1500, imagen: "../assets/espresso.jpg" },
    { nombre: "Capuchino", precio: 2500, imagen: "../assets/capuchino.jpg" },
    { nombre: "Latte", precio: 3500, imagen: "../assets/latte.jpg" },
    { nombre: "Media Luna", precio: 500, imagen: "../assets/medialunas.jpg" },
    { nombre: "Promoción", precio: 3000, imagen: "../assets/promocion.jpg" }
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarProductos() {
    const menuDiv = document.getElementById('menu');
    menuDiv.innerHTML = ''; 

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
        menuDiv.appendChild(productoCard);
    });

    agregarEventosBotones(); 
}

function agregarEventosBotones() {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    
    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            agregarAlCarrito(index);
        });
    });
}

function agregarAlCarrito(index) {
    const productoSeleccionado = productos[index];
    const productoEnCarrito = carrito.find(item => item.nombre === productoSeleccionado.nombre);

    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad: 1 });
    }

    actualizarCarrito();
    mostrarMensajeAgregado();
}

function actualizarCarrito() {
    const carritoDiv = document.getElementById('carrito');
    carritoDiv.innerHTML = ''; 

    carrito.forEach((producto, index) => {
        carritoDiv.innerHTML += `
            <p>${producto.nombre} - $${producto.precio} x ${producto.cantidad} = $${producto.precio * producto.cantidad} 
            <button data-index="${index}" class="btn btn-sm btn-success btn-sumar">+</button>
            <button data-index="${index}" class="btn btn-sm btn-warning btn-restar">-</button>
            <button data-index="${index}" class="btn btn-sm btn-danger btn-quitar">Quitar</button></p>
        `;
    });

    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
    carritoDiv.innerHTML += `<p>Total: $<span id="total">${total}</span></p>`;
    
    carritoDiv.innerHTML += `
        <button id="btn-hacer-pedido" class="btn btn-primary">Hacer pedido</button>
    `;

    localStorage.setItem('carrito', JSON.stringify(carrito)); 

    agregarEventosBotonesCarrito(); 

    const btnHacerPedido = document.getElementById('btn-hacer-pedido');
    btnHacerPedido.addEventListener('click', mostrarOpcionEntrega);

    verificarEstadoPedido();
}

function mostrarMensajeAgregado() {
    alert("Producto agregado al carrito.");
}

function agregarEventosBotonesCarrito() {
    const botonesSumar = document.querySelectorAll('.btn-sumar');
    const botonesRestar = document.querySelectorAll('.btn-restar');
    const botonesQuitar = document.querySelectorAll('.btn-quitar');

    botonesSumar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            sumarProducto(index);
        });
    });

    botonesRestar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            restarProducto(index);
        });
    });

    botonesQuitar.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            quitarDelCarrito(index);
        });
    });
}

function sumarProducto(index) {
    carrito[index].cantidad++;
    actualizarCarrito();
}

function restarProducto(index) {
    if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--;
        actualizarCarrito();
    }
}

function quitarDelCarrito(index) {
    carrito.splice(index, 1); 
    actualizarCarrito();
}

function verificarEstadoPedido() {
    const btnHacerPedido = document.getElementById('btn-hacer-pedido');
    
    if (carrito.length === 0) {
        btnHacerPedido.disabled = true;
    } else {
        btnHacerPedido.disabled = false;
    }
}

function mostrarOpcionEntrega() {
    const opcionesDiv = document.createElement('div');
    opcionesDiv.innerHTML = `
        <h4>¿Es para llevar o servir?</h4>
        <button id="btn-llevar" class="btn btn-info">Para llevar</button>
        <button id="btn-servir" class="btn btn-info">Para servir</button>
    `;

    document.body.appendChild(opcionesDiv);

    document.getElementById('btn-llevar').addEventListener('click', () => {
        alert("Pedido en camino");
    });

    document.getElementById('btn-servir').addEventListener('click', () => {
        alert("Enseguida le atendemos a su mesa");
    });
}

document.getElementById('limpiarCarrito').addEventListener('click', () => {
    carrito = [];
    actualizarCarrito();
});

document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    actualizarCarrito();
});
