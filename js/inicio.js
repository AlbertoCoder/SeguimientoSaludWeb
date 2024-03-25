
var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;
var btnEntrar;
var solicitud;

function crearDB(){


  var solicitud = indexedDB.open("Seguimiento_Salud_Web", 1);

  solicitud.onupgradeneeded = function (event) {
    var db = event.target.result;
    console.log(event.target.result);
    var objectStore = db.createObjectStore("Usuarios", { autoIncrement: true });
    objectStore.createIndex("Nombre", "Nombre", { unique: false });
    objectStore.createIndex("Apellidos", "Apellidos", { unique: false });
  };


}


function DBExiste(nombre) {

  var solicitud = window.indexedDB.open(nombre);

  let existe;


  solicitud.onsuccess = function (event) {

    existe = true;
  }

  solicitud.onerror = function (event) {

    existe = false;

  }
  console.log(existe);

  return existe;

}

window.onload = () => {


  selector_usuario = document.getElementById('select_usuarios');
  formulario_nuevo_usuario = document.getElementById('div_interno_nuevo_usuario');
  itNombre = document.getElementById('itNombre');
  itApellidos = document.getElementById('itApellidos');
  btnEntrar = document.getElementById('btnEntrar');



  if (selector_usuario.options.length === 1) {

    mostrarFormularioNuevoUsuario(1);

  }

  crearDB();

  cargarDatosDB();

  btnEntrar.addEventListener("click", () => {

    if (selector_usuario.value === "Crear Nuevo") {

      ejecutarCRUD("crear", { Nombre: itNombre.value, Apellidos: itApellidos.value });

    } else {

      let indi = selector_usuario.value.split('.')[0];
      navegarConDatos("formulario_datos.html", indi);

    }



  });


  selector_usuario.addEventListener("change", () => {
    if (selector_usuario.value === "Crear Nuevo") {

      mostrarFormularioNuevoUsuario(1);

    } else {


      mostrarFormularioNuevoUsuario(0);

    }

  });

}


function navegarConDatos(url, dato) {

  sessionStorage.setItem("indi", dato);

  window.location.href = url;

}


function mostrarFormularioNuevoUsuario(opc) {

  if (opc === 1) {

    formulario_nuevo_usuario.classList.remove("invisible");
    formulario_nuevo_usuario.classList.add('visible');

  } else {

    formulario_nuevo_usuario.classList.add("invisible");
    formulario_nuevo_usuario.classList.remove('visible');

  }


}

function agregarOpcionesListaDesplegable(indi, opc) {


  var opcion = document.createElement("option");
  opcion.value = indi + ".- " + opc.Nombre + " " + opc.Apellidos;
  opcion.text = indi + ".- " + opc.Nombre + " " + opc.Apellidos;
  selector_usuario.appendChild(opcion);

}



function cargarDatosDB() {

  var solicitud = indexedDB.open("Seguimiento_Salud_Web", 1);

  solicitud.onsuccess = (event) => {

    var db = event.target.result;

    var transaccion = db.transaction(["Usuarios"], "readonly");

    var objectStore = transaccion.objectStore("Usuarios");

    var cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = (event) => {

      var cursor = event.target.result;

      if (cursor) {

        var usuario = cursor.value;
        agregarOpcionesListaDesplegable(cursor.primaryKey, usuario);
        cursor.continue();


      } else {

        console.log("No hay más datos.");
      }

    };

  }

  solicitud.onerror = (event) => {

    alert("No fue posible cargar la lista de usuarios: " + event.errorCode);


  }

}

function ejecutarCRUD(operac, dato, callback) {

  var solicitud = indexedDB.open("Seguimiento_Salud_Web", 1);

  solicitud.onupgradeneeded = function (event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("Usuarios", { autoIncrement: true });
    objectStore.createIndex("Nombre", "Nombre", { unique: false });
    objectStore.createIndex("Apellidos", "Apellidos", { unique: false });
  };

  solicitud.onsuccess = function (event) {

    var db = event.target.result;
    var transaction = db.transaction(["Usuarios"], "readwrite");
    var objectStore = transaction.objectStore("Usuarios");

    switch (operac) {
      case "crear":
        var solicitudAgregarObjeto = objectStore.add(dato);
        solicitudAgregarObjeto.onsuccess = function (event) {
          console.log("Dato agregador correctamente con id: " + event.target.result);
          if (callback) callback(event.target.result);

          alert(`${dato.Nombre} ${dato.Apellidos} correctamente agregado/a.`);
        };
        solicitudAgregarObjeto.onerror = function (event) {
          console.error("Error agregando el objeto: " + event.target.errorCode);
        };
        break;

      case "leer":
        var solicitudLectura = objectStore.get(dato);
        solicitudLectura.onsuccess = function (event) {
          console.log("Dato recuperado correctamente: ", event.target.result);
          if (callback) callback(event.target.result);
        };
        solicitudlectura.onerror = function (event) {
          console.error("Error al recuperar el dato: " + event.target.errorCode);
        };
        break;
      case "actualizar":
        var solicitudActualizar = objectStore.put(dato);
        solicitudActualizar.onsuccess = function (event) {
          console.log("Dato actualizado correctamente:");
          if (callback) callback();
        };
        solicitudActualizar.onerror = function (event) {
          console.error("Error al actualizar el dato: " + event.target.errorCode);
        };
        break;
      case "borrar":
        var solicitudBorrar = objectStore.delete(dato);
        solicitudBorrar.onsuccess = function (event) {
          console.log("Dato borrado correctamente:");
          if (callback) callback();
        };
        solicitudBorrar.onerror = function (event) {
          console.error("Error al borrar el dato: " + event.target.errorCode);
        };
        break;
      default:
        console.error("Operación Inválida: " + operation);
    }

    transaction.oncomplete = function () {
      console.log("Transacción completa.");
    };

    transaction.onerror = function (event) {
      console.error("Error en la transacción: " + event.target.errorCode);
    };
  };

  solicitud.onerror = function (event) {
    console.error("Error en la base de datos: " + event.target.errorCode);
  };

  location.reload();

}