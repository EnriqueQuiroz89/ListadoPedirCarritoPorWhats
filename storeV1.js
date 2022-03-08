

// Array que almacena Solo Claves.
let carrito = [];
const divisa = '$';
const DOMarticulos = document.querySelector('#articulos');
const DOMcarrito = document.querySelector('#carrito');
const DOMtotal = document.querySelector('#total');
const DOMordenar = document.querySelector('#ordenar');
const DOMbotonVaciar = document.querySelector('#boton-vaciar');
const miLocalStorage = window.localStorage;


function renderizarRealizarCompra() {
    const miBotonOrdenar = document.createElement('button');
    miBotonOrdenar.classList.add('btn');
    miBotonOrdenar.textContent = 'Pedir por Whats';
    miBotonOrdenar.addEventListener('click', enviarPedidoPorWhatsApp);
    DOMordenar.appendChild(miBotonOrdenar);
}


//Renderizar Articulos
function renderizarArticulosFirebase() {

    console.log("Si llego desde la funcion Chida");

    let articulosRef = db.collection("articulos");

    articulosRef.orderBy("fechaHoraModificacion", "desc").onSnapshot((querySnapshot) => {
        //table.innerHTML = "";
        // console.log(`${doc.id} => ${doc.data().fechaHora}`);

        // POr cada Nodo o DOcumento en Firebase
        // Equivalente NODO a DOCUMENTO
        querySnapshot.forEach((doc) => {
            // Estructura
            const miNodo = document.createElement('div');
            //miNodo.classList.add('card', 'col-sm-4');
            miNodo.classList.add('card')

            // Body
            const miNodoCardBody = document.createElement('div');
            //miNodoCardBody.classList.add('card-body');
            miNodo.classList.add('card-body')

            // Titulo
            const miNodoTitle = document.createElement('h5');
            miNodoTitle.classList.add('card-title');
            miNodoTitle.textContent = doc.data().articulo;
            // Imagen
            const miNodoImagen = document.createElement('img');
            miNodoImagen.classList.add('img-fluid');
            miNodoImagen.setAttribute('src', doc.data().imagen);
            // Precio
            const miNodoTexto = document.createElement('p');
            miNodoTexto.classList.add('card-text');
            miNodoTexto.textContent = `${doc.data().descripcion}`;
            // Precio
            const miNodoPrecio = document.createElement('p');
            miNodoPrecio.classList.add('card-price');
            miNodoPrecio.textContent = `${divisa} ${doc.data().precio}`;
            // Boton 

            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('btn', 'btn-primary');
            miNodoBoton.textContent = 'Agregar al Pedido';
            miNodoBoton.setAttribute('marcador', doc.id);
            // miNodoBoton.setAttribute('onclick', "anyadirProductoAlCarritoVersion2(" + doc.data().precio + ")");
            //Agregar funcion On click con los dtaos del articulo seleccionado
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            // Insertamos

            miNodoCardBody.appendChild(miNodoTitle);
            miNodoCardBody.appendChild(miNodoImagen);
            miNodoCardBody.appendChild(miNodoTexto);
            miNodoCardBody.appendChild(miNodoPrecio);
            miNodoCardBody.appendChild(miNodoBoton);
            miNodo.appendChild(miNodoCardBody);
            DOMarticulos.appendChild(miNodo);
        });
    });


}

/**Evento para añadir un producto al carrito de la compra*/
function anyadirProductoAlCarrito(evento) {
    // Anyadimos el Nodo a nuestro carrito
    // AQUI CAPTURO EL iD QUE YO DECIDI GURADR EN EL BOTON
    carrito.push(evento.target.getAttribute('marcador'))
    //Aqui lo muestro
    console.log(evento.target)
    // Muesra contenido
    console.log("Carrito contiene solo IDs" + carrito);
    /**Adicional Borrrar*/
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();
}

function enviarPedidoPorWhatsApp() {
    // El carrito Tiene
    console.log("Carrito contiene solo IDs" + carrito);
    /**Adicional Borrrar*/
    // window.open("https://wa.me/5215545158142?text=Carrito%20" + carrito);
    let textoAMandar = "https://wa.me/5215545158142?text=%20" + carritoEnTexto(carrito);
    window.open(textoAMandar);
}

function carritoEnTexto() {

    let carritoTextoParaWhats = "";

    carrito.forEach((item) => {  // Guarda solo los ID
        //let valor = item;
        carritoTextoParaWhats += "%20-------%20" + item + "%20-------%20";
    })

    return carritoTextoParaWhats
}


function renderizarCarrito() {
    // Vaciamos todo el html
    // Div donde se colocara el Carrito
    DOMcarrito.textContent = '';

    // Clonamos el Arreglo Carrito
    const carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach((item) => {  // Guarda solo los ID

        // Cuenta el número de veces que se repite el producto
        const numeroUnidadesItem = carrito.reduce((total, itemId) => {
            // ¿Coincide las id? Incremento el contador, en caso contrario lo mantengo
            return itemId === item ? total += 1 : total;
        }, 0);

        // Creamos el nodo del item del carrito
        const miNodo = document.createElement('li');
        miNodo.classList.add('articulo-carrito');

        const miCantidad = document.createElement('div');
        miCantidad.classList.add('cantidad-articulo-carrito')

        const miTexto = document.createElement('div');
        miTexto.classList.add('texto-articulo-carrito')

        const miPrecioTotalPorArticulo = document.createElement('div');
        miPrecioTotalPorArticulo.classList.add('precio-total-articulo-carrito')

        // Agrega el Texto al carrito
        let docRef = db.collection("articulos").doc(item);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                miCantidad.textContent = ` ${numeroUnidadesItem} x `;
                miTexto.textContent = ` ${doc.data().articulo} - `;
                miPrecioTotalPorArticulo.textContent = ` ${divisa} ${doc.data().precio}`;
                // Boton de borrar
                const miBoton = document.createElement('button');
                miBoton.classList.add('btn', 'btn-danger', 'mx-5');
                miBoton.textContent = 'X';
                miBoton.style.marginLeft = '1rem';
                miBoton.dataset.item = item;
                miBoton.addEventListener('click', borrarItemCarrito);
                // Mezclamos nodos
                miNodo.appendChild(miCantidad);
                miNodo.appendChild(miTexto);
                miNodo.appendChild(miPrecioTotalPorArticulo);
                miNodo.appendChild(miBoton);
                DOMcarrito.appendChild(miNodo);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
                miNodo.textContent = ` 1 x Error de Lectura - Error de Lectura`;
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    });

    // Renderizamos el precio total en el HTML
    // DOMtotal.textContent = calcularTotalFirebase();
}

function guardarCarritoEnLocalStorage() {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDeLocalStorage() {
    // ¿Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
    }
}
/* Evento para borrar un elemento del carrito **/

function borrarItemCarrito(evento) {
    // Obtenemos el producto ID que hay en el boton pulsado
    const id = evento.target.dataset.item;
    // Borramos todos los productos
    carrito = carrito.filter((carritoId) => {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Actualizamos el LocalStorage
    guardarCarritoEnLocalStorage();

}

/***Al iniciar */
cargarCarritoDeLocalStorage();
renderizarArticulosFirebase();
renderizarCarrito();
renderizarRealizarCompra();