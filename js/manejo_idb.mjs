export var matriz_resultado = [];

export function insertarRegistro(nmbBD, nmbObjSt, datos_registro) {

  var solicitudApertura = indexedDB.open(nmbBD, 1);


  solicitudApertura.addEventListener("success", async(event) => {

    var db = await event.target.result;
    var transac = db.transaction([nmbObjSt], "readwrite");
    var objSt = transac.objectStore(nmbObjSt);


    var solicitudInsertarRegistro = objSt.add(datos_registro);

  solicitudInsertarRegistro.addEventListener("success", async(event) => {

      await console.log("Dato agregado: " + event.target.result);

      alert(`REGISTRO: ${datos_registro.Nombre} ${datos_registro.Apellidos} insertado correctamente.`);

    });

  solicitudInsertarRegistro.addEventListener("error", (event) => {

      console.error("Error al insertar el registro: " + event.target.errorCode);

    });

    transac.addEventListener("complete", async() => {

      await console.log("Transacción completa.");


    });

    transac.addEventListener("error", (event) => {

      console.error("Error en la transacción: " + event.target.errorCode);

    })


  });

  solicitudApertura.addEventListener("error", (event) => {

    console.error("Error al abrir la base de datos: " + event.target.errorCode);

  });

  //location.reload(); 
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

          matriz_resultado.push(usuario);

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