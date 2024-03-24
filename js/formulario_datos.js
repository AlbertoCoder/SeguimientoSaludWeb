
var indice = sessionStorage.getItem("indi");
var nomusuario_barra_nav;

window.onload = function () {

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  console.log(indice);
  ejecutarCRUD("leer", null,parseInt(indice), null);
}

function ejecutarCRUD(operac, dato,indice, callback) {

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
        var solicitudLectura = objectStore.get(indice);
        solicitudLectura.onsuccess = function (event) {
          console.log("Dato recuperado correctamente: ", event.target.result);
          if (callback) callback(event.target.result);
          nomusuario_barra_nav.innerHTML = event.target.result.Nombre + " " + event.target.result.Apellidos;
        };
        solicitudLectura.onerror = function (event) {
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

}