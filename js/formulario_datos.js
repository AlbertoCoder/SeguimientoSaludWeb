import { cargarDatosDB, insertarRegistro } from "./manejo_idb.mjs";

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var it_fecha, it_peso, it_glucosa, it_o2, it_sist, it_diast, it_ppm, it_pasos, it_kms, it_cals;
var btnInsertarRegistro;
var usuario;

window.onload = function () {

  cargarDatosDB("Seguimiento_Salud_Web", "Usuarios").then(matriz => {

    usuario = matriz[parseInt(idusuario_seleccionado) - 1];
    nomusuario_barra_nav.innerHTML = `Usuario/a: ${usuario.Nombre} ${usuario.Apellidos}`;

  });


  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");
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

  btnInsertarRegistro.addEventListener("click", () => {

    idusuario_seleccionado = sessionStorage.getItem("id_usuario").split(".")[0];
    console.log(idusuario_seleccionado);
    var nombre_usu=nomusuario_barra_nav.innerHTML.split(" ")[1];
    var apellido1_usu=nomusuario_barra_nav.innerHTML.split(" ")[2];
    var apellido2_usu=nomusuario_barra_nav.innerHTML.split(" ")[3];

    var mediciones_prueba = {

      N:parseInt(idusuario_seleccionado),
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

    insertarRegistro("Seguimiento_Salud_Web", "Mediciones", mediciones_prueba);

  });

}

