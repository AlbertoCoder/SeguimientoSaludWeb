import { abrirDB, insertarRegistro, leerUnRegistro, leerTodosLosRegistros } from "./manejo_idb.mjs";

var n = parseInt(sessionStorage.getItem("registro_edición"));

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var it_fecha, it_peso, it_glucosa, it_o2, it_sist, it_diast, it_ppm, it_pasos, it_kms, it_cals;
var btnInsertarRegistro, btnEliminarRegistro, btnLimpiarFormulario;
var baseDeDatos;
var btnInicio, btnTabla;
var opcInserción;

window.onload = function() {


  document.documentElement.requestFullscreen();

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  opcInserción = sessionStorage.getItem("opcInserción");

  btnInicio = document.getElementById("btnInicio");

  btnInicio.addEventListener("click", function() {

    window.location.href = "index.html";


  });

  btnTabla = document.getElementById("btnTabla");

  btnTabla.addEventListener("click", function() {

    window.location.href = "tabla_datos.html";


  });

  abrirDB("Seguimiento_Salud_Web", "success").then(db => {

    baseDeDatos = db;
    leerUnRegistro(db, "Usuarios", parseInt(idusuario_seleccionado)).then(resultado => {

      nomusuario_barra_nav.innerHTML = `Usuario/a: ${idusuario_seleccionado}`;

    });

    mostrarRegistroEnFormulario(baseDeDatos);
  }).catch(error => {

    console.error(error);

  });

  it_fecha = document.getElementById("it_fecha");
  it_peso = document.getElementById("it_peso");
  it_glucosa = document.getElementById("it_glucosa");
  it_o2 = document.getElementById("it_o2");
  it_sist = document.getElementById("it_sist");
  it_diast = document.getElementById("it_diast");
  it_ppm = document.getElementById("it_ppm");
  it_pasos = document.getElementById("it_pasos");
  it_kms = document.getElementById("it_kms");
  it_cals = document.getElementById("it_cals");
  btnInsertarRegistro = document.getElementById("btnInsertarRegistro");
  btnEliminarRegistro = document.getElementById("btnEliminarRegistro");
  btnLimpiarFormulario = document.getElementById("btnLimpiarFormulario");

  btnInsertarRegistro.addEventListener("click", () => {

    idusuario_seleccionado = sessionStorage.getItem("id_usuario").split(" ")[0];

    var nombre_usu = nomusuario_barra_nav.innerHTML.split(" ")[2];
    var apellido1_usu = nomusuario_barra_nav.innerHTML.split(" ")[3];
    var apellido2_usu = nomusuario_barra_nav.innerHTML.split(" ")[4];

    var mediciones_prueba = {

      N: parseInt(idusuario_seleccionado),
      Nombre: nombre_usu,
      Apellidos: `${apellido1_usu} ${apellido2_usu}`,
      Fecha: it_fecha.value,
      Peso: it_peso.value,
      Glucosa: it_glucosa.value,
      O2: it_o2.value,
      Sist: it_sist.value,
      Diast: it_diast.value,
      PPM: it_ppm.value,
      Pasos: it_pasos.value,
      Kms: it_kms.value,
      Cals: it_cals.value
    }

    insertarRegistro(baseDeDatos, "Mediciones", n, opcInserción, mediciones_prueba).then(resultado => {


      alert(`Registro guardado con fecha ${resultado.Fecha}`);
      window.location.href = "tabla_datos.html";

    });

    n = null;

    mostrarRegistroEnFormulario(baseDeDatos);

  });

  btnLimpiarFormulario.addEventListener("click", limpiarFormulario);

}

function mostrarRegistroEnFormulario(nmbBD) {




  leerTodosLosRegistros(nmbBD, "Mediciones").then(resultado => {

    try {

      it_fecha.value = resultado.get(n).Fecha;
      it_peso.value = resultado.get(n).Peso;
      it_glucosa.value = resultado.get(n).Glucosa;
      it_o2.value = resultado.get(n).O2;
      it_sist.value = resultado.get(n).Sist;
      it_diast.value = resultado.get(n).Diast;
      it_ppm.value = resultado.get(n).PPM;
      it_pasos.value = resultado.get(n).Pasos;
      it_kms.value = resultado.get(n).Kms;
      it_cals.value = resultado.get(n).Cals;



    } catch (error) {

      console.log("Inserción de nuevo registro.");

    }

  });
}

function limpiarFormulario() {

  it_fecha.value = null;
  it_peso.value = null;
  it_glucosa.value = null;
  it_o2.value = null;
  it_sist.value = null;
  it_diast.value = null;
  it_ppm.value = null;
  it_pasos.value = null;
  it_kms.value = null;
  it_cals.value = null;

}
