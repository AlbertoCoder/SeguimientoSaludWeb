//API de IndexedDB en https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

import { abrirDB, crearAlmacénDeObjetos, crearÍndice, insertarRegistro } from "./manejo_idb.mjs";
var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;

var btnEntrar, btnEliminarUsuario;
var baseDeDatos, almacénUsuarios, almacénMediciones;

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

  abrirDB("Seguimiento_Salud_Web", "upgradeneeded").then(db => {

    almacénUsuarios = crearAlmacénDeObjetos(db, "Usuarios", { autoIncrement: true });
    almacénMediciones = crearAlmacénDeObjetos(db, "Mediciones", { autoIncrement: true });

    crearÍndice(almacénUsuarios, "Nombre", false);
    crearÍndice(almacénUsuarios, "Apellidos", false);

    crearÍndice(almacénMediciones, "id_usuario", false);
    crearÍndice(almacénMediciones, "Fecha", false);
    crearÍndice(almacénMediciones, "Glucosa", false);
    crearÍndice(almacénMediciones, "Peso", false);
    crearÍndice(almacénMediciones, "O2", false);
    crearÍndice(almacénMediciones, "Sist", false);
    crearÍndice(almacénMediciones, "Diast", false);
    crearÍndice(almacénMediciones, "PPM", false);
    crearÍndice(almacénMediciones, "Pasos", false);
    crearÍndice(almacénMediciones, "Kms", false);
    crearÍndice(almacénMediciones, "Cals", false);

    baseDeDatos = db;

  }).catch(error => {

    console.error(error);

  });

  abrirDB("Seguimiento_Salud_Web", "success").then(db => {

    baseDeDatos = db;


  }).catch(error => {

    console.error(error);

  });

  btnEntrar.addEventListener("click", async () => {

    console.log(baseDeDatos);

    if (selector_usuario.value === "Crear Nuevo") {
      insertarRegistro(baseDeDatos, "Usuarios", { Nombre: itNombre.value, Apellidos: itApellidos.value }).then(event => {

        console.log(event.target.result);
        alert(`${itNombre.value} ${itApellidos.value} -- CORRECTO.`);
      });

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


  btnEliminarUsuario.addEventListener("click", () => {

    eliminarRegistro("Seguimiento_Salud_Web", "Usuarios", 1);


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

async function agregarOpcionesListaDesplegable() {

  try {

    var matriz = await ejecutarCRUD("Seguimiento_Salud_Web", "Usuarios", "leer_todos", null, "registros", null);
    console.log(matriz);

    matriz.forEach((elemento) => {
      console.log("Hey");
      let opcion = document.createElement("option");
      opcion.value = elemento.Nombre + " " + elemento.Apellidos;
      opcion.text = elemento.Nombre + " " + elemento.Apellidos;
      selector_usuario.appendChild(opcion);
    });


  } catch (error) {

    console.log(error);

  }
}
