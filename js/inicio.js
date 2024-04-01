//API de IndexedDB en https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

import { cargarDatosDB, insertarRegistro } from "./manejo_idb.mjs";
var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;

var btnEntrar,btnEliminarUsuario;

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
    objectStoreMediciones.createIndex("por_id", "N", { unique: false });
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

function borrarRegistro(){



}


window.onload = () => {

  selector_usuario = document.getElementById('select_usuarios');
  formulario_nuevo_usuario = document.getElementById('div_interno_nuevo_usuario');
  itNombre = document.getElementById('itNombre');
  itApellidos = document.getElementById('itApellidos');
  btnEntrar = document.getElementById('btnEntrar');
  btnEliminarUsuario = document.getElementById('btnEliminarUsuario');

  if (selector_usuario.options.length === 1) {

    mostrarFormularioNuevoUsuario(1);

  }

  crearDB("Seguimiento_Salud_Web");
  cargarDatosDB("Seguimiento_Salud_Web", "Usuarios").then((matriz)=>{

    agregarOpcionesListaDesplegable(matriz);

  });

  btnEntrar.addEventListener("click", async() => {


    if (selector_usuario.value === "Crear Nuevo") {

      await insertarRegistro("Seguimiento_Salud_Web","Usuarios", {Nombre: itNombre.value, Apellidos: itApellidos.value });
      location.reload();

    } else {

      let indi = selector_usuario.value.split('.')[0];
      navegarConDatos("formulario_datos.html", indi);

    }


  });


  selector_usuario.addEventListener("change", () => {
    if (selector_usuario.value === "Crear Nuevo") {

      mostrarFormularioNuevoUsuario(1);
      btnEliminarUsuario.classList.add("invisible");
      btnEliminarUsuario.classList.remove("visible");
      btnEntrar.innerHTML = "Crear Usuario";
    } else {


      mostrarFormularioNuevoUsuario(0);
      btnEntrar.innerHTML = "Continuar";
      btnEliminarUsuario.classList.remove("invisible");
      btnEliminarUsuario.classList.add("visible");

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

function agregarOpcionesListaDesplegable(matriz) {
 
  matriz.forEach((elemento,ind)=>{

    let opcion = document.createElement("option");
    console.log(elemento);
    opcion.value = (ind + 1) + ".-" + elemento.Nombre + " " + elemento.Apellidos;
    opcion.text = (ind + 1) + ".-" + elemento.Nombre + " " + elemento.Apellidos;
    selector_usuario.appendChild(opcion);

  });

}