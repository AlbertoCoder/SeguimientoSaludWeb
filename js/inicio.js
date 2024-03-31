//API de IndexedDB en https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;
var btnEntrar;
var solicitud;

function crearDB(nmbBD) {

  //Análisis del código: "indexedDB" es un objeto "IDBFactory"
  //que la interfaz "Window" de la API de JavaScript tiene
  //declarado como propiedad/atributo. El método open(nombre_de_la_bd,version)
  //inmediatamente devuelve un objeto que implementa la interfaz "IDBOpenDBRequest" al mismo tiempo
  //que ejecuta la operación de abrir la base de datos de forma asíncrona.
  //El mencionado objeto "IDBOpenDBRequest" es almacenado en la variable "solicitud".
  //Si la operación es exitosa, automáticamente se lanza un evento "success" del objeto
  //que implementa la interfaz "IDBOpenDBRequest" el cual tiene un atributo "result" 
  //que se iniciará automáticamente también con el valor "IDBDatabase". 
  //Es decir, el atributo "result" contendrá el objeto base de datos.
  const solicitud = window.indexedDB.open(nmbBD, 1);

  //El evento "onupgradeneeded" se lanza cuando hay un intento de abrir una base de datos con un
  //número de versión superior al de la versión actual.
  //El parámetro "event" de la función con la que se inicia el evento "onupgradeneeded" del objeto
  //"solicitud" (que implementa la interfaz IDBOpenDBRequest).
  solicitud.addEventListener("upgradeneeded",(event)=> {

    //El objeto "event" (que implementa la interfaz "IDBVersionChangeEvent") pasado por 
    //parámetro a la retrollamada tiene propiedades como "target", "type" y otras.
    //La propiedad "target" hace referencia al objeto "solicitud" que implementa la interfaz 
    //"IDBOpenDBRequest", es decir, el objeto desde el cual se lanza el evento "upgradeneeded".    
    var db = event.target.result; //Se inicia la variable "db" con el objeto "result" (implementa "IDBDatabase").

    //Información en consola:
    console.log("Objeto: " + event.target.result);
    console.log("Nombre de la base de datos: " + event.target.result.name);
    console.log("Versión: " + event.target.result.version);
    
    //El método "createObjectStore" del objeto "db" crea y devuelve un nuevo objeto que implementa
    //la interfaz "IDBObjectStore" (es decir, una tabla de base de datos).
    //El primer parámetro corresponde al nombre del "objectStore" (dicho de otro modo, el nombre de la tabla)
    //y el segundo parámetro corresponde a una matriz de opciones, entre las cuales caben destacar
    //el "keyPath" (la ruta que hace referencia al nombre del campo clave) y "autoIncrement", un valor
    //booleano que, de ser establecido en verdadero, indicará que la tabla tiene un generador de clave
    //autoincremental. 
    var objectStoreUsuarios = db.createObjectStore("Usuarios", { autoIncrement: true });

    //El método "createIndex" del objeto "objectStoreUsuarios" (que implementa la interfaz "IDBObjectStore")
    //crea y devuelve un nuevo objeto que implementa la interfaz "IDBIndex".
    //Los parámetros corresponden al nombre del índice "por_nombre", al campo "Nombre" y las opciones
    //"unique:false" (no es un campo con valor único). 
    objectStoreUsuarios.createIndex("por_nombre", "Nombre", { unique: false });
    objectStoreUsuarios.createIndex("por_apellidos", "Apellidos", { unique: false });
    
    
    var objectStoreMediciones = db.createObjectStore("Mediciones", { autoIncrement: true });
    objectStoreMediciones.createIndex("por_id", "ID", { unique: true });
    objectStoreMediciones.createIndex("por_nombre", "Nombre", { unique: false });
    objectStoreMediciones.createIndex("por_apellidos", "Apellidos", { unique: false });
    objectStoreMediciones.createIndex("por_fecha", "Fecha", { unique: false });
    objectStoreMediciones.createIndex("por_glucosa", "Glucosa", { unique: false });
    objectStoreMediciones.createIndex("por_peso", "Peso", { unique: false });
    objectStoreMediciones.createIndex("por_o2", "O2", { unique: false });
    objectStoreMediciones.createIndex("por_sist", "Sist", { unique: false });
    objectStoreMediciones.createIndex("por_diast", "Diast", { unique: false });
    objectStoreMediciones.createIndex("por_ppm", "PPM", { unique: false });
    objectStoreMediciones.createIndex("por_pasos", "Pasos", { unique: false });
    objectStoreMediciones.createIndex("por_kms", "Kms", { unique: false });
    objectStoreMediciones.createIndex("por_cals", "Cals", { unique: false });

  });

}


async function insertarRegistro(nmbBD,nmbObjSt,datos_registro){

  var solicitudApertura = indexedDB.open(nmbBD, 1);


  await solicitudApertura.addEventListener("success",(event)=>{

    var db = event.target.result;
    var transac = db.transaction([nmbObjSt],"readwrite");
    var objSt = transac.objectStore(nmbObjSt);


    var solicitudInsertarRegistro = objSt.add(datos_registro);

    solicitudInsertarRegistro.addEventListener("success",(event)=>{

      console.log("Dato agregado: " + event.target.result);      

      alert(`REGISTRO: ${datos_registro.Nombre} ${datos_registro.Apellidos} insertado correctamente.`);

    });

    solicitudInsertarRegistro.addEventListener("error",(event)=>{

      console.error("Error al insertar el registro: " + event.target.errorCode);

    });
    
    transac.addEventListener("complete",()=>{

      console.log("Transacción completa.");


    });

    transac.addEventListener("error",(event)=>{

      console.error("Error en la transacción: " + event.target.errorCode);      

    })


  });

  solicitudApertura.addEventListener("error",(event)=>{

    console.error("Error al abrir la base de datos: " + event.target.errorCode);

  });
  
   location.reload(); 
}


function borrarRegistro(){



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

  crearDB("Seguimiento_Salud_Web");
  cargarDatosDB("Seguimiento_Salud_Web", "Usuarios");

  btnEntrar.addEventListener("click", async() => {

    if (selector_usuario.value === "Crear Nuevo") {

      await insertarRegistro("Seguimiento_Salud_Web","Usuarios", { Nombre: itNombre.value, Apellidos: itApellidos.value });

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

  sessionStorage.setItem("id_usuario", selector_usuario.value);

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



function cargarDatosDB(nmbBD, nmbObjSt) {

  var solicitud = indexedDB.open(nmbBD, 1);

  solicitud.onsuccess = (event) => {

    var db = event.target.result;

    var transaccion = db.transaction(nmbObjSt, "readonly");

    var objectStore = transaccion.objectStore(nmbObjSt);

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



/*


function ejecutarCRUD(nmbObjStore,operac, dato, callback) {


  solicitud.onupgradeneeded = function (event) {

    var db = event.target.result;
    var transaction = db.transaction([nmbObjStore], "readwrite");
    var objectStore = transaction.objectStore(nmbObjStore);

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

*/