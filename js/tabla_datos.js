import { abrirDB, insertarRegistro, leerUnRegistro, leerTodosLosRegistros } from "./manejo_idb.mjs";

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var it_fecha, it_peso, it_glucosa, it_o2, it_sist, it_diast, it_ppm, it_pasos, it_kms, it_cals;
var btnInsertarRegistro, btnEliminarRegistro, btnLimpiarFormulario;
var tabla_datos;
var baseDeDatos;

window.onload = function() {

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  tabla_datos = document.getElementById("tabla_datos");

  abrirDB("Seguimiento_Salud_Web", "success").then(db => {

    baseDeDatos = db;
    leerUnRegistro(db, "Usuarios", parseInt(idusuario_seleccionado)).then(resultado => {

      nomusuario_barra_nav.innerHTML = `Usuario/a: ${idusuario_seleccionado}`;

    });

    generarRegistrosEntabla(baseDeDatos);
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

}

function generarRegistrosEntabla(baseDeDatos) {

  leerTodosLosRegistros(baseDeDatos, "Mediciones").then(mapa_datos => {

    for (let registro = 1; registro <= mapa_datos.size; registro++) {

      const nueva_fila = document.createElement('tr');
      tabla_datos.appendChild(nueva_fila);

      for (let celda = 0; celda < 11; celda++) {

        const nueva_celda = document.createElement('td');
        nueva_celda.innerHTML = mapa_datos.get(registro).N;
        nueva_fila.appendChild(nueva_celda);

      }

    }

  });

}

