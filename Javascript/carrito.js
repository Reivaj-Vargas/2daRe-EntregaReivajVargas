let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let pedidoRealizado = false;
let opcionesDiv;

function agregarAlCarrito(index, productos) {
    try {
        const productoSeleccionado = productos[index];
        const productoEnCarrito = carrito.find(item => item.nombre === productoSeleccionado.nombre);

        if (productoEnCarrito) {
            productoEnCarrito.cantidad++;
        } else {
            carrito.push({ ...productoSeleccionado, cantidad: 1 });
        }

        actualizarCarrito();
        mostrarMensajeAgregado();
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
    }
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

    document.getElementById('btn-hacer-pedido').addEventListener('click', mostrarOpcionEntrega);

    verificarEstadoPedido();
    actualizarContadorCarrito();
}

function mostrarOpcionEntrega() {
    if (carrito.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Por favor, agrega productos al carrito antes de hacer un pedido',
        });
        return;
    }

    Swal.fire({
        title: 'Elige la opción de entrega',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Para llevar',
        denyButtonText: `Para servir`,
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            hacerPedido('llevar');
        } else if (result.isDenied) {
            hacerPedido('servir');
        }
    });
}

function hacerPedido(opcion) {
    manejarOpcionPedido(opcion);
    const total = calcularTotal();
    

    const ahora = luxon.DateTime.now();
    Swal.fire({
        icon: 'info',
        title: 'Pedido realizado',
        html: `Fecha y hora del pedido: <strong>${ahora.toLocaleString(luxon.DateTime.DATETIME_MED)}</strong><br>Total: <strong>$${total}</strong>`,
    }).then(() => {
        Swal.fire({
            title: 'Ingrese sus datos',
            html: `
                <input id="nombre" class="swal2-input" placeholder="Nombre">
                <input id="apellido" class="swal2-input" placeholder="Apellido">
                <input id="correo" class="swal2-input" placeholder="Correo" type="email">
            `,
            confirmButtonText: 'Enviar',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const apellido = Swal.getPopup().querySelector('#apellido').value;
                const correo = Swal.getPopup().querySelector('#correo').value;

                if (!nombre || !apellido || !correo) {
                    Swal.showValidationMessage('Por favor, complete todos los campos');
                }
                return { nombre, apellido, correo };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { nombre, apellido, correo } = result.value;
                Swal.fire({
                    icon: 'success',
                    title: 'Gracias por tu pedido',
                    html: `Nombre: ${nombre} ${apellido}<br>Correo: ${correo}<br>Total: $${total}`
                });
            }
        });
    });
}

function verificarEstadoPedido() {
    const btnHacerPedido = document.getElementById('btn-hacer-pedido');
    
    if (carrito.length === 0) {
        btnHacerPedido.disabled = true;
        Swal.fire({
            icon: 'info',
            title: 'Carrito vacío',
            text: 'Por favor, agrega productos al carrito antes de hacer un pedido',
        });
    } else {
        btnHacerPedido.disabled = false; 
    }
    if (pedidoRealizado) {
        btnHacerPedido.disabled = true;
        Swal.fire({
            icon: 'success',
            title: 'Pedido realizado',
            text: 'Gracias por tu pedido, ya está en proceso.',
        });
    }
}


function calcularTotal() {
    return carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
}

function eliminarOpcionesEntrega() {
    opcionesDiv = document.getElementById('opciones-entrega');
    if (opcionesDiv) {
        opcionesDiv.remove();
    }
}

function manejarOpcionPedido(opcion) {
    const mensaje = opcion === 'llevar' ? 'Pedido en camino' : 'Le atenderemos enseguida en su mesa';
    Swal.fire({
        icon: 'info',
        title: 'Opción de entrega',
        text: mensaje,
    });
    eliminarOpcionesEntrega();
}

function hacerPedido(opcion) {
    manejarOpcionPedido(opcion);
    const total = calcularTotal();


    const ahora = luxon.DateTime.now();
    Swal.fire({
        icon: 'info',
        title: 'Pedido realizado',
        html: `Fecha y hora del pedido: <strong>${ahora.toLocaleString(luxon.DateTime.DATETIME_MED)}</strong><br>Total: <strong>$${total}</strong>`,
    }).then(() => {
        
        Swal.fire({
            title: 'Ingrese sus datos',
            html: `
                <input id="nombre" class="swal2-input" placeholder="Nombre">
                <input id="apellido" class="swal2-input" placeholder="Apellido">
                <input id="correo" class="swal2-input" placeholder="Correo" type="email">
            `,
            confirmButtonText: 'Enviar',
            focusConfirm: false,
            preConfirm: () => {
                const nombre = Swal.getPopup().querySelector('#nombre').value;
                const apellido = Swal.getPopup().querySelector('#apellido').value;
                const correo = Swal.getPopup().querySelector('#correo').value;

                if (!nombre || !apellido || !correo) {
                    Swal.showValidationMessage('Por favor, complete todos los campos');
                }
                return { nombre, apellido, correo };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const { nombre, apellido, correo } = result.value;
                Swal.fire({
                    icon: 'success',
                    title: 'Gracias por tu pedido',
                    html: `Nombre: ${nombre} ${apellido}<br>Correo: ${correo}<br>Total: $${total}`
                });
            }
        });
    });
}

function agregarEventosBotonesCarrito() {
    document.querySelectorAll('.btn-sumar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            carrito[index].cantidad++;
            actualizarCarrito();
        });
    });

    document.querySelectorAll('.btn-restar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            if (carrito[index].cantidad > 1) {
                carrito[index].cantidad--;
            } else {
                carrito.splice(index, 1);
            }
            actualizarCarrito();
        });
    });

    document.querySelectorAll('.btn-quitar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            const index = e.target.dataset.index;
            carrito.splice(index, 1);
            actualizarCarrito();
        });
    });
}

function mostrarMensajeAgregado() {
    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        showConfirmButton: false,
        timer: 1000
    });
}

function actualizarContadorCarrito() {
    const cartCount = carrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

try {
    actualizarCarrito();
} catch (error) {
    console.error('Error al inicializar el carrito:', error);
}
