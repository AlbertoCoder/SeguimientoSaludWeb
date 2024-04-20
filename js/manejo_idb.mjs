export var matriz_resultado = [];

export function abrirDB(nmbBD, nombreEvento) {

  const solicitud = window.indexedDB.open(nmbBD, 1);

  return manejarSolicitudAperturaDB(solicitud, nombreEvento);

}

function manejarSolicitudAperturaDB(solicitud, nombreEvento) {

  return new Promise((resolve, reject) => {
    solicitud.addEventListener(nombreEvento, (event) => {

      resolve(event.target.result);

    });

  });

}

export function crearAlmacénDeObjetos(db, nmbObjSt, opc) {

  return db.createObjectStore(nmbObjSt, opc);

}

export function crearÍndice(nmbObjSt, nmbÍndice, único) {

  nmbObjSt.createIndex(`por_${nmbÍndice}`, nmbÍndice, { unique: único });

}

export function insertarRegistro(nmbBD, nmbObjSt, num_reg, opcInserción, datos) {

  return new Promise((resolve, reject) => {

    nmbBD.transaction(nmbObjSt, "readwrite")
      .objectStore(nmbObjSt)
      .put(datos, opcInserción).onsuccess = (event) => {

        resolve(datos);

      }

  });

}

export function leerUnRegistro(nmbBD, nmbObjSt, num_reg) {

  return new Promise((resolve, reject) => {

    nmbBD.transaction(nmbObjSt, "readwrite")
      .objectStore(nmbObjSt)
      .get(num_reg).onsuccess = (event) => {

        resolve(event.target.result);


      }

  });

}

export function leerTodosLosRegistros(nmbBD, nmbObjSt) {

  const resultado_registros = new Map();

  return new Promise((resolve, reject) => {

    nmbBD.transaction(nmbObjSt, "readonly")
      .objectStore(nmbObjSt)
      .openCursor().onsuccess = (event) => {

        if (event.target.result) {

          resultado_registros.set(event.target.result.key, event.target.result.value);
          event.target.result.continue();

        } else {
          resolve(resultado_registros);
        }
      }

  });

}

export function obtenerPromedios(nmbBD, nmbObjSt, idusuario, índice) {


  let promedio = 0;
  let contador = 0;
  return new Promise((resolve, reject) => {

    nmbBD.transaction(nmbObjSt, "readonly")
      .objectStore(nmbObjSt)
      .openCursor().onsuccess = (event) => {

        if (event.target.result) {

          promedio += parseFloat(event.target.result.value[índice]);
          contador++;
          console.log(`El contador para el usuario con id ${event.target.result.value.N} está en ${contador}`);
          event.target.result.continue();

        } else {
          console.log("Promedio: " + promedio / contador);
          resolve(promedio / contador);
        }
      }

  });


}

export function eliminarRegistro(nmbBD, nmbObjSt, num_reg) {

  return new Promise((resolve, reject) => {

    nmbBD.transaction(nmbObjSt, "readwrite")
      .objectStore(nmbObjSt)
      .delete(parseInt(num_reg)).onsuccess = (event) => {

        resolve(`${parseInt(num_reg)}`);

      };
  });
}

/*

export function crearDB(nmbBD) {

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
  solicitud.addEventListener("upgradeneeded", (event) => {

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
*/
