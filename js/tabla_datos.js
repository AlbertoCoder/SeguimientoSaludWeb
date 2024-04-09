import { abrirDB, insertarRegistro, leerUnRegistro, leerTodosLosRegistros } from "./manejo_idb.mjs";

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var it_fecha, it_peso, it_glucosa, it_o2, it_sist, it_diast, it_ppm, it_pasos, it_kms, it_cals;
var btnInsertarRegistro, btnEliminarRegistro, btnLimpiarFormulario;
var usuario;
var baseDeDatos;

window.onload = function() {

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  abrirDB("Seguimiento_Salud_Web", "success").then(db => {

    baseDeDatos = db;
    leerUnRegistro(db, "Usuarios", parseInt(idusuario_seleccionado)).then(resultado => {

      nomusuario_barra_nav.innerHTML = `Usuario/a: ${idusuario_seleccionado}`;

    });

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

    insertarRegistro(baseDeDatos, "Mediciones", mediciones_prueba).then(resultado => {

      alert(`Registro agregado con fecha ${resultado.Fecha}`);

    });

    mostrarRegistroEnFormulario();

  });

  btnLimpiarFormulario.addEventListener("click", limpiarFormulario);

}

function mostrarRegistroEnFormulario() {


  leerTodosLosRegistros(baseDeDatos, "Mediciones").then(resultado => {

    console.log("Valor: " + resultado.get(resultado.size).Fecha);
    it_fecha.value = resultado.get(resultado.size).Fecha;
    it_peso.value = resultado.get(resultado.size).Peso;
    it_glucosa.value = resultado.get(resultado.size).Glucosa;
    it_o2.value = resultado.get(resultado.size).O2;
    it_sist.value = resultado.get(resultado.size).Sist;
    it_diast.value = resultado.get(resultado.size).Diast;
    it_ppm.value = resultado.get(resultado.size).PPM;
    it_pasos.value = resultado.get(resultado.size).Pasos;
    it_kms.value = resultado.get(resultado.size).Kms;
    it_cals.value = resultado.get(resultado.size).Cals;

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
