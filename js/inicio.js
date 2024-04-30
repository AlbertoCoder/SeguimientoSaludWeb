//API de IndexedDB en https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase

import {
  abrirDB,
  crearAlmacénDeObjetos,
  crearÍndice,
  insertarRegistro,
  leerTodosLosRegistros,
  eliminarRegistro
} from "./manejo_idb.mjs";

var selector_usuario;
var itNombre, itApellidos;
var formulario_nuevo_usuario;
var btnEntrar, btnEliminarUsuario;
var baseDeDatos, almacénUsuarios, almacénMediciones;
var sonido_correcto = new Audio("recursos/snd/ok.wav");

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.register('../sw.js')
    .then((reg) => console.log('Trabajador de servicio registrado.', reg))
    .catch((err) => console.log('Trabajador de servicio NO registrado.', err));

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
    agregarOpcionesListaDesplegable();
    //leerTodosLosRegistros(baseDeDatos,"Usuarios");


  }).catch(error => {

    console.error(error);

  });


  btnEntrar.addEventListener("click", async () => {

    console.log(baseDeDatos);

    if (selector_usuario.value === "Crear Nuevo") {
      insertarRegistro(baseDeDatos, "Usuarios", "nuevo", null, { Nombre: itNombre.value, Apellidos: itApellidos.value }).then(resultado => {

        console.log(`Objeto agregado ${resultado}`);
      });
      sonido_correcto.play();
      let mensaje_usuario_correcto = new MensEmergente("Bienvenida", "¡Bienvenido / a, " + itNombre.value + "!", "¡Gracias!");

      document.body.appendChild(mensaje_usuario_correcto);
      //alert(`${itNombre.value} ${itApellidos.value} -- CORRECTO.`);

    } else {

      let indi = selector_usuario.value.split(' ')[0];
      navegarConDatos("tabla_datos.html", indi);

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

    try {

      eliminarRegistro(baseDeDatos, "Usuarios", selector_usuario.value.split(" ")[0]).then(msj => {

        let confirmar = confirm(`¿Seguro que quieres eliminar el registro de usuario ${selector_usuario.value}?`);

        if (confirmar === true) {

          leerTodosLosRegistros(baseDeDatos, "Mediciones").then(mapa => {

            let valores = Array.from(mapa.values());

            valores.forEach((elemento, ind) => {

              console.log(elemento);

              if (elemento.N === parseInt(selector_usuario.value.split(" ")[0])) {

                eliminarRegistro(baseDeDatos, "Mediciones", ind + 1).then(num => {

                  console.log(`Registro ${num} eliminado`)

                });


              }

            });


          });


          console.log(`Objeto con id: ${msj} eliminado.`);

          alert(`${selector_usuario.value} eliminado.`);

          //location.reload();
          selector_usuario.innerHTML = '<option value="Crear Nuevo">Crear Nuevo</option>';
          agregarOpcionesListaDesplegable();

        } else {

          alert("Aquí no ha pasado nada :-)");

        }


      });


    } catch (error) {

      console.error(error);

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

function agregarOpcionesListaDesplegable() {

  try {

    leerTodosLosRegistros(baseDeDatos, "Usuarios", "registros").then(mapa => {
      let claves = Array.from(mapa.keys());
      let valores = Array.from(mapa.values());

      claves.forEach((elemento, ind) => {
        let opcion = document.createElement("option");
        opcion.value = elemento + " " + valores[ind].Nombre + " " + valores[ind].Apellidos;
        opcion.text = elemento + " " + valores[ind].Nombre + " " + valores[ind].Apellidos;
        selector_usuario.appendChild(opcion);
      });


    });



  } catch (error) {

    console.log(error);

  }
}

