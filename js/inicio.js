//API de IndexedDB en https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

import { crearDB, ejecutarCRUD } from "./manejo_idb.mjs";
var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;

var btnEntrar, btnEliminarUsuario;


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


  agregarOpcionesListaDesplegable();


  btnEntrar.addEventListener("click", async () => {


    if (selector_usuario.value === "Crear Nuevo") {

      await ejecutarCRUD("Seguimiento_Salud_Web", "Usuarios", "crear", { Nombre: itNombre.value, Apellidos: itApellidos.value }, null, null);

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