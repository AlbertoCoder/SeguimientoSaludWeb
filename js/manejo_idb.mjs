export var matriz_resultado = [];


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

export async function ejecutarCRUD(nmbBD, nmbObjSt, operac, dato, tipoLectura, num_reg) {

  let solicitud = indexedDB.open(nmbBD, 1);

  await solicitud.addEventListener("success", (event) => {

    let db = event.target.result;
    let transac = db.transaction([nmbObjSt], "readwrite");
    let objSt = transac.objectStore(nmbObjSt);

    switch (operac) {

      case "crear":

        let solicitudCrear = objSt.add(dato);

        solicitudCrear.onsuccess = (event) => {

          console.log("Dato agregado: " + event.target.result);

          alert(`${dato.Nombre} ${dato.Apellidos} - CORRECTO.`);

        }

        break;

      case "leer_todos":

        let solicitudLeerTodos = objSt.openCursor();

        solicitudLeerTodos.onsuccess = (event) => {

          let cursor = event.target.result;

          if (cursor) {

            let objeto;

            if (tipoLectura === "registros") {

              objeto = cursor.value;

            } else if (tipoLectura === "claves") {

              objeto = cursor.key;

            }

            matriz_resultado.push(objeto);

            cursor.continue();

          } else {

            console.log("No hay más datos.");
          }
        }
        solicitudLeerTodos.onerror = (event) => {

          alert("No fue posible cargar la lista de usuarios: " + event.errorCode);

        }
        break;

      case "eliminar":

        let solicitudEliminarRegistro = objSt.delete(num_reg);

        solicitudEliminarRegistro.onsuccess = (event) => {

          console.log("Registro eliminado: " + event.target.result);

        }

        solicitudEliminarRegistro.onerror = (event) => {

          alert("No fue posible eliminar el registro:\n" + event.target.errorCode);

        }
        transac.addEventListener("complete", () => {

          console.log("Transacción completa.");

        });

        transac.addEventListener("error", (event) => {

          console.error("Error en la transacción: " + event.target.errorCode);


        });
        break;
    }


  });

  return matriz_resultado;

}

/*

export async function insertarRegistro(nmbBD, nmbObjSt, datos_registro) {

  var solicitudApertura = indexedDB.open(nmbBD, 1);

  solicitudApertura.addEventListener("success", async (event) => {

    var db = event.target.result;
    var transac = db.transaction([nmbObjSt], "readwrite");
    var objSt = transac.objectStore(nmbObjSt);

    var solicitudInsertarRegistro = objSt.add(datos_registro);

    await solicitudInsertarRegistro.addEventListener("success", (event) => {

      console.log(event.target.result);
      console.log("Dato agregado: " + event.target.result);

      alert(`REGISTRO: ${datos_registro.Nombre} ${datos_registro.Apellidos} insertado correctamente.`);

    });
    solicitudInsertarRegistro.addEventListener("error", async (event) => {

      await console.error("Error al insertar el registro: " + event.target.errorCode);

    });


    transac.addEventListener("complete", async () => {

      await console.log("Transacción completa.");


    });

    transac.addEventListener("error", async (event) => {

      await console.error("Error en la transacción: " + event.target.errorCode);

    });



  });




}


export function cargarDatosDB(nmbBD, nmbObjSt) {

  return new Promise((resolve, reject) => {
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

          matriz_resultado.push(cursor.key, usuario);

          cursor.continue();

        } else {

          console.log("No hay más datos.");
          resolve(matriz_resultado);

        }

      };

    }

    solicitud.onerror = (event) => {

      alert("No fue posible cargar la lista de usuarios: " + event.errorCode);


    }


  });

}

export async function eliminarRegistro(nmbBD, nmbObjSt, num_reg) {

  var solicitudApertura = indexedDB.open(nmbBD, 1);

  solicitudApertura.addEventListener("success", async (event) => {

    var db = event.target.result;
    var transac = db.transaction([nmbObjSt], "readwrite");
    var objSt = transac.objectStore(nmbObjSt);

    var solicitudEliminarRegistro = objSt.delete(num_reg);

    solicitudEliminarRegistro.addEventListener("success", (event) => {

      console.log(event.target.result);
      console.log("Dato eliminado: " + event.target.result);

      alert(`REGISTRO: ${num_reg} eliminado correctamente.`);

    });
    solicitudEliminarRegistro.addEventListener("error", async (event) => {

      console.error("Error al eliminar el registro: " + event.target.errorCode);

    });


    transac.addEventListener("complete", async () => {

      await console.log("Transacción completa.");


    });

    transac.addEventListener("error", async (event) => {

      await console.error("Error en la transacción: " + event.target.errorCode);

    });


  });

}

*/