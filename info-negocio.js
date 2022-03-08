if ("loading" in HTMLImageElement.prototype) {
    // Si el navegador soporta lazy-load, tomamos todas las imágenes que tienen la clase
    // `lazyload`, obtenemos el valor de su atributo `data-src` y lo inyectamos en el `src`.
    const images = document.querySelectorAll("img.lazyload");
    images.forEach((img) => {
        img.src = img.dataset.src;
    });
    // Muestra mensaje
    console.log("El navegador soporta `lazy-loading`...");
} else {
    // Importamos dinámicamente la libreria `lazysizes`
    let script = document.createElement("script");
    script.async = true;
    script.src =
        "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js";
    document.body.appendChild(script);
    console.log("Lazi loading no soportado, incorpora Libreria lazysizes.min.js");
}

/// Inicializar CLOUDINARI para la carga de imagenes.
const cloudName = 'muchosregistros';      // Mi cuenta
const unsignedUploadPreset = 'bbisdqo0';  // Mi almacen publico

// URL que invoca el recuadro para elegir la imagen de INPUT de abajo
var fileSelect = document.getElementById("fileSelect");
// Es el INPUT de tipo file para cargar un archivo
var fileElem = document.getElementById("fileElem");

/**Texto de los botones*/
const save = 'Guardar';
const cancel = 'Cancelar';

// Constantes GLOBALES formulario
const miNegocio = document.getElementById('negocio'),
    miVariedad = document.getElementById('variedad'),
    miRangoPrecios = document.getElementById('rango-precios'),
    miHorario = document.getElementById('horario'),
    miImagen = document.getElementById('imagen');
// VAlores de los campos de texto
var miValorNegocio = document.getElementById('negocio').value,
    miValorVariedad = document.getElementById('variedad').value,
    miValorRangoPrecios = document.getElementById('rango-precios').value,
    miValorHorario = document.getElementById('horario').value,
    miValorImagen = document.getElementById('imagen').value;


const formNegocio = document.getElementById('form-negocio'),
    miBoton = document.getElementById('boton');

/**Imagen por default en el fomulario */
const urlImagenDefault = 'https://res.cloudinary.com/muchosregistros/image/upload/w_100,c_scale/v1645734002/vcgsorn2397ptsd71pjg.png';

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC7IxVax8cZ5eLwEhlHE5leNVlX7TBUIQ0",
    authDomain: "firestorecrud-f8226.firebaseapp.com",
    projectId: "firestorecrud-f8226",
});

var db = firebase.firestore();

//Controla la accion del boton enviar
// controlar Funcion Submit del formulario
formNegocio.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarOrCancelar();
});

formNegocio.addEventListener('change', (event) => {
    console.log("Hubo cambios");

    if (checkInputs() === true) {
        console.log("campos Vacios");
        setSubmitDisable(miBoton);
    } else {
        console.log("Sin campos vacios");
        setSubmitEnable(miBoton);
    }
})

// ACTIVA / DESACTIVA Boton enviar
setSubmitDisable(miBoton);

function setSubmitDisable(boton) {
    boton.disabled = true;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = 'inactivo enviar';
}
function setSubmitEnable(boton) {
    boton.disabled = false;
    const botonControl = boton.parentElement;  // .form-control
    //Agrega la clase del boton Inactivo
    botonControl.className = ' enviar';
}

//Agrega Imagen por default al Formulario
setImagenPorDefault(urlImagenDefault);

/**Carga una imagen por default para un producto*/
function setImagenPorDefault(url) {
    // Coloca Url por default 
    document.getElementById('imagen').value = url;
    // Cambio Imagen vacio por Default
    document.getElementById('imagen').value = '';


    // Agrega Imagen por default a la galeria 
    let imgDefault = new Image(); // HTML5 Constructor
    imgDefault.src = url;  /**Asigna el nuevo URL reconfigurado con escala*/
    imgDefault.alt = 'Imagen de articulo por default';  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(imgDefault); /**Agrega a la Galeria la imagen recien creada*/
}

// Devuelve TRUE si hay un error y FALSE si no lo hay.
function checkInputs() {
    // Obtiene el contenido de los inputs
    const negocioValue = miNegocio.value.trim(),
        variedadValue = miVariedad.value.trim(),
        RangoPreciosValue = miRangoPrecios.value.trim(),
        horarioValue = miHorario.value.trim();


    let haveAnError = false;

    if (negocioValue === '') {
        haveAnError = true;
    }
    if (variedadValue === '') {
        haveAnError = true;
    }
    if (RangoPreciosValue === '') {
        haveAnError = true;
    }
    if (horarioValue === '') {
        haveAnError = true;
    }
    ///Al cargar la imagen llenar el campo imagenValue con la URL Cloudinary;
    // Poner un listener a campo Imagen para que cuando cargue devuelva True y se habilite el boton enviar
    return haveAnError;
}

// GUARDA o CANCELA segun el Texto que Tenga.
function guardarOrCancelar() {  /// Esta podria ir dentro de la funcion Guardar
    let texto = document.getElementById('boton').innerHTML;

    switch (texto) {
        case cancel:
            //Limpia el Formulario
            resetFormulario();
            // Suprime el boton de Guardar cambios               
            document.getElementById('guardar-edicion').style.display = 'none';
            break;
        case save:
            //Valida los campos y escribe en Firebase mediante guardar()
            if (checkInputs() === false) {
                console.log('No hubo errores, envia los datos');
                guardar();
                //  resetFormulario();
            } else {
                console.log('Hubo errores, no envies los datos');
            }
            break;
        default:
            //Declaraciones ejecutadas cuando ninguno de los valores coincide con el valor de la expresión
            console.log('Ningun texto coincide');
            document.getElementById('boton').innerHTML = addToList;
            break;
    }
}

/**Estilos del Campo de Texto*/
function setInicialFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase por defecto o inicial
    formControl.className = 'form-control inicial';
}
function setErrorFor(input, message) {
    const formControl = input.parentElement;  // .form-control
    const small = formControl.querySelector('small');
    small.innerText = message;
    // Modifica la clase del elemento 
    formControl.className = 'form-control error';
}
function setSuccessFor(input) {
    const formControl = input.parentElement;  // .form-control
    // Agrega la clase error
    formControl.className = 'form-control success';
}

// Activa estilo EXITO / ERROR para campo vacio
function aplicaEstiloAlInput(input) {
    let nombreMayus = input.id.toString().toUpperCase();
    if (input.value.trim() === '') {
        setErrorFor(input, nombreMayus + ' no puede quedar vacio');
    } else {
        setSuccessFor(input);
    }
}

/**Accion GANA / PIERDE Focus un Campo*/
miNegocio.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miVariedad.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miRangoPrecios.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
miHorario.addEventListener('focusin', (event) => {
    event.target.style.background = 'paleturquoise';
});
/**Pierde  */
miNegocio.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miVariedad.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miRangoPrecios.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});
miHorario.addEventListener('focusout', (event) => {
    event.target.style.background = '';
    aplicaEstiloAlInput(event.target);
});

/**Toma la imagen que se carga la procesa y reduce su pixelaje*/
function processRedimencionaUploadImagen(file) {
    // referencia el input donde carga la imagen
    // const file = document.querySelector("#upload").files[0];
    /**Crea un Lector de archivos*/
    const reader = new FileReader();
    // SI el input esta vacio finaliza la funcion
    if (!file) {
        console.log("No se ha seleccionado ninguna Imagen");
        return
    };
    /**readAsDataURL es usado para leer el contenido del especificado Blob o File */
    reader.readAsDataURL(file);
    /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
    reader.onload = function (event) {
        /**Crea un nuevo elemento tipo imagen*/
        const imgElement = document.createElement("img");
        /**Le asigna una fuente a la iamgen*/
        imgElement.src = event.target.result;
        /**result en  readAsDataURL() -> Es una cadena con una URL que 
         * representa los datos del archivo. result data: */
        /**VISUAL*///        document.querySelector("#input").src = event.target.result;

        /*FileReader: load event-->The event is fired when a file has been read successfully.load**/
        imgElement.onload = function (e) {

            let masLargo = 0,
                masCorto = 0,
                sX = 0,
                sY = 0;

            /**Calculo del recorte del original*/
            if (e.target.width > e.target.height) {
                console.log("LA imagen es horizontal");
                masLargo = e.target.width;
                masCorto = e.target.height;
                //Ej. Imagen Horizontal -> width:300 height:180
                // (300-180)/2 = 120/2 = 60
                // Result:   !-60-!---180---!-60-!  = 300 
                sX = (masLargo - masCorto) / 2;
            } else {
                console.log("LA imagen es vertical");
                masLargo = e.target.height;
                masCorto = e.target.width;
                //Ej. Imagen Vertical -> width:180 height:300
                // (300-180)/2 = 120/2 = 60
                // Result:   !-60-!---180---!-60-!  = 300
                sY = (masLargo - masCorto) / 2;
            }

            /**La etiqueta HTML5 <canvas> se utiliza para 
     * dibujar gráficos, sobre la marcha, con JavaScript.*/
            const canvas = document.createElement("canvas");
            // Ancho que ha de tener el grafico a crear
            const MAX_WIDTH = 150;
            /**Tamaño en pixeles de la reduccion*/
            canvas.width = MAX_WIDTH;
            /**Al ser cuadrada tendra el mismo alto que ancho*/
            canvas.height = MAX_WIDTH;

            // ¿Que tanto hacia la derecha del original y hacia abajo?
            // El lado mas corto sera nuestra referencia para hacer el cuadrado
            let sWidth = masCorto;  /**Medida mas corta de la imagen*/
            let sHeight = masCorto;

            /**canvas CanvasElement.getContext() retorna un contexto de dibujo en el lienzo,
             *  o null si el identificador del contexto no está soportado.*/
            /**"2d", dando lugar a la creación de un objeto CanvasRenderingContext2D 
             * que representa un contexto de renderizado de dos dimensiones. */
            const ctx = canvas.getContext("2d");
            //DIBUJA ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            ctx.drawImage(e.target, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

            /**Con la informacion codificada crea la ruta de la imagen resultado */
            const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");
            /**Imprime la ruta de la imagen resultado*/
            //console.log(srcEncoded);

            /**Invoca al metodo encargado de Subir la imagen a Cloudinary*/
            uploadFile(srcEncoded);
        };
    };
};


/**Como se precarga la imagen que va a Cloudinary*/
/**SELECCION DE IMAGEN*/
/** Pasos
 *  1. Al hacer Click en el Link "Elige imagen" invoca funcion(e) anonima
 *  2. La funcion anonima evalua si existe la variable "fileElem" 
 *  3. fileElem es la invocacion  de un input de tipo archivo que esta oculto
 *  4. Al existir fileElem la funcion simula un Click en el campo y despliega 
 *     la ventana para elegir.   
 */
fileSelect.addEventListener("click", function (e) {
    if (fileElem) {
        fileElem.click();
    }
    e.preventDefault(); // prevent navigation to "#"
}, false);

/**Se invoca desde el campo tipo FILE al percibir un cambio*/
// *********** Handle selected files ******************** //
var manejarFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        processRedimencionaUploadImagen(files[i]);
    }
};
//Ya no se usa pero es Util
/**Carga la imagen con la resolucion Original*/
var handleFiles = function (files) {
    for (var i = 0; i < files.length; i++) {
        uploadFile(files[i]); // call the function to upload the file
    }
};

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {

    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

    /**Limpia de la Galeria la Imagen Anterior*/
    document.getElementById('gallery').innerHTML = '';
    // Reset the upload progress bar
    document.getElementById('progress').style.width = 0;
    //Restaura el color a la barra
    document.getElementById('progress').style.background = "yellow";

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {

        document.getElementById('porcentaje').innerHTML = ``; /*Resetea el porcentaje*/
        /**Calcula el progeso de la carga*/
        var progress = Math.round((e.loaded * 100.0) / e.total);   ///Toatal 340kb   loaded 125kb = 125*100/340 kb
        /**Incrementa el ancho del progreso*/
        document.getElementById('progress').style.width = progress + "%";

        /**Crea y agrega la etiqueta que contiene el avance en Numero*/
        var newLabel = document.createElement('label');
        newLabel.innerHTML = `${progress} %`;
        document.getElementById('porcentaje').appendChild(newLabel);

        console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);

        console.log(progress);
        if (progress === 100) {
            /**Cambia de color al finalizar la carga*/
            document.getElementById('progress').style.background = "lime";
        }

    });
    /**Presentacion del Tumbnail en Galeria*/
    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // File uploaded successfully
            var response = JSON.parse(xhr.responseText);
            // https://res.cloudinary.com/cloudName/image/upload/v1483481128/public_id.jpg

            /**Extrae la URL del JSON respuesta*/
            var url = response.secure_url;
            console.log(url); /**URL extraida de la respuesta */

            // Create a thumbnail of the uploaded image, with 150px width
            var tokens = url.split('/'); /**DIVIDE LA URL y su delimitador es */

            console.log(tokens); /**Arreglo de strings con el resultado de la division. */

            tokens.splice(-2, 0, 'w_100,c_scale'); /**Inserta elemento dos posiciones antes ultimo*/
            // w=width y h=height --> 150=150 px                 

            var img = new Image(); // HTML5 Constructor
            img.src = tokens.join('/');  /**Asigna el nuevo URL reconfigurado con escala*/
            img.alt = response.public_id;  /**Por si no se muestra la imagen*/
            /**Agrega a la Galeria la imagen recien creada*/
            document.getElementById('gallery').appendChild(img);

            // Agrega URL de la miniatura en el campo Imagen
            document.getElementById('imagen').value = img.src;

            /**Muestra la opcion para cambiar Imagen*/
            document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';

            // Si Carga Imagen OK y campos estan llenos Activa el Boton 
            if (checkInputs() === false) {
                console.log("Imagen Mostrada y campos llenos");
                setSubmitEnable(miBoton);
            }
        }
    };

    fd.append('upload_preset', unsignedUploadPreset);
    fd.append('tags', 'browser_upload'); // Optional - add tag for image admin in Cloudinary
    fd.append('file', file);
    xhr.send(fd);
} // Fin de upload FILE

// Agregar documentos
function guardar() {
    //Almacena contenido de los campos
    let negocio = document.getElementById('negocio').value,
        variedad = document.getElementById('variedad').value,
        rangoPrecios = document.getElementById('rango-precios').value,
        horario = document.getElementById('horario').value,
        imagen = document.getElementById('imagen').value;
    //Calcula fecha y hora Actual para registrar hora de creacion
    let timeStamp = new Date(Date.now());

    db.collection("negocios").add({
        negocio: negocio,
        variedad: variedad,
        rangoPrecios: rangoPrecios,
        horario: horario,
        imagen: imagen,
        fechaHoraCreacion: timeStamp,
        fechaHoraModificacion: timeStamp,
    })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //Restaura el formulario
            resetFormulario();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

/**Donde Mostrar los Datos?? */
// En Una Tabla 
var table = document.getElementById('table');

// LEE Documentos de Firebase
//  Visualizacion en Tiempo Real
/** Traer datos Una sola vez => Get()
 *  Leer Cambios y mostrarlos => onSnapshot
 * Remplaza get()  por onSnapshot()
 * Se Elimina .get().then((querySnapshot)...) y queda .onSnapshot((querySnapshot)...) 
 */

let comprasRef = db.collection("negocios");
comprasRef.onSnapshot((querySnapshot) => {
    table.innerHTML = "";
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().fechaHora}`);
        table.innerHTML += `
        <tr>
        <td>${doc.data().negocio}</td>        
        <td>${doc.data().variedad}</td>
        <td>${doc.data().rangoPrecios}</td>
        <td>${doc.data().horario}</td>
        </tr>
        <tr>
        <td><img src="${doc.data().imagen}" alt="${doc.data().imagen}" class="imagen-articulo"></td>
        <td><button class="btn btn-warning" onclick="editar('${doc.id}','${doc.data().negocio}','${doc.data().variedad}','${doc.data().rangoPrecios}','${doc.data().horario}','${doc.data().imagen}')">Editar</button></td>
        <td><button class="btn btn-danger" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        </tr>
        <tr></tr>        
        <tr></tr>                
        `
    });
});

// BORRAR documentos
function eliminar(id) {
    db.collection("negocios").doc(id).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}

// EDITAR documento
function editar(id, negocio, variedad, rangoPrecios, horario, imagen) {
    /**Activa el Boton de GUARDAR / CANCELAR*/
    setSubmitEnable(miBoton);
    //Limpia la galeria de la imagen por default
    limpiaGaleria();
    // Escribe en los campos los valores del renglon seleccionado
    document.getElementById('negocio').value = negocio;
    document.getElementById('variedad').value = variedad;
    document.getElementById('rango-precios').value = rangoPrecios;
    document.getElementById('horario').value = horario;
    document.getElementById('imagen').value = imagen;
    // Muestra la imagen en Galery para que pueda ser editada.
    var img = new Image(); // HTML5 Constructor
    img.src = imagen;  /**Asigna el nuevo URL reconfigurado con escala*/
    img.alt = imagen;  /**Por si no se muestra la imagen*/
    document.getElementById('gallery').appendChild(img); /**Agrega a la Galeria la imagen recien creada*/

    //Edita el texto del boton
    document.getElementById('boton').innerHTML = cancel;

    /**Cambia el Texto por si el User quiere cambiar la imagen */
    document.getElementById('fileSelect').innerHTML = 'Cambiar imagen';
    /**Muetra el boton para guardar edicion*/
    var btnGuardarEdicion = document.getElementById('guardar-edicion');
    btnGuardarEdicion.style.display = 'unset';

    // Crea una funcion anonima para ejecutar cuando se haga click
    btnGuardarEdicion.onclick = function () {
        // El ID no va a cambiar
        let negocioRef = db.collection("negocios").doc(id);
        // Capturar los cambios realizados en los campos
        let negocioEditado = document.getElementById('negocio').value,
            variedadEditada = document.getElementById('variedad').value,
            rangoPreciosEditado = document.getElementById('rango-precios').value,
            horarioEditado = document.getElementById('horario').value,
            imagenEditada = document.getElementById('imagen').value;
        // Calcula la fecha y hora actual del cambio 
        let timeStamp = new Date(Date.now());

        // Actualiza los cambios
        return negocioRef.update({
            negocio: negocioEditado,
            variedad: variedadEditada,
            rangoPrecios: rangoPreciosEditado,
            horario: horarioEditado,
            imagen: imagenEditada,
        })
            .then(() => {
                console.log("Document successfully updated!");
                //Limpia el formulario
                resetFormulario();
                //Oculta Boton Edicion
                btnGuardarEdicion.style.display = 'none';
            })
            .catch((error) => {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            });
    }
}



function resetFormulario() {
    // Si exito Regresa al boton su texto original
    document.getElementById('boton').innerHTML = save;
    // Limpia los campos
    document.getElementById('negocio').value = '';
    document.getElementById('variedad').value = '';
    document.getElementById('rango-precios').value = '';
    document.getElementById('horario').value = '';

    /**Limpia la Galeria*/
    limpiaGaleria();
    /**Resetea la barra de progreso*/
    document.getElementById('progress').style.width = 0;
    /**Borra el porcentaje en numero*/
    document.getElementById('porcentaje').innerHTML = '';
    // Regresa el texto original
    document.getElementById('fileSelect').innerHTML = 'Elije una imagen';
    //Restablece la imagen Por Default
    setImagenPorDefault(urlImagenDefault);
    /**Deshabilita el Boton */
    setSubmitDisable(miBoton);
}

function limpiaGaleria() {
    document.getElementById('gallery').innerHTML = '';
}

formNegocio.addEventListener('submit', () => {
    console.log('El formulario ha sido enviado');
    resetValidaciones();
});

function resetValidaciones() {
    /**Uso constantes iniciales
     * const miArticulo = document.getElementById('articulo')*/
    setInicialFor(miNegocio, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miVariedad, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miRangoPrecios, 'Nombre del articulo no puede quedar vacio');
    setInicialFor(miHorario, 'Nombre del articulo no puede quedar vacio');
}

