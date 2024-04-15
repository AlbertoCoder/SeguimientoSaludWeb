import { abrirDB, insertarRegistro, leerUnRegistro, leerTodosLosRegistros, obtenerPromedios } from "./manejo_idb.mjs";

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var it_fecha, it_peso, it_glucosa, it_o2, it_sist, it_diast, it_ppm, it_pasos, it_kms, it_cals;
var btnInsertarRegistro, btnEliminarRegistro, btnLimpiarFormulario;
var tabla_datos;
var baseDeDatos;
var selector_fecha_inicio, selector_fecha_fin;
var promedio_peso, promedio_glucosa, promedio_o2, promedio_sist, promedio_diast, promedio_ppm, promedio_pasos,
  promedio_kms, promedio_cals;
var total_pasos, total_kms, total_cals;
var datos_promedios;

window.onload = function() {

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  tabla_datos = document.getElementById("tabla_datos");
  datos_promedios = document.getElementById("datos_promedios");

  abrirDB("Seguimiento_Salud_Web", "success").then(db => {

    baseDeDatos = db;
    leerUnRegistro(db, "Usuarios", parseInt(idusuario_seleccionado)).then(resultado => {

      nomusuario_barra_nav.innerHTML = `Usuario/a: ${idusuario_seleccionado}`;

    });

    let índices = ["Peso", "Glucosa", "O2", "Sist", "Diast", "PPM", "Pasos", "Kms", "Cals"];
    generarRegistrosEntabla(baseDeDatos, índices).then(resultado => {


      console.log(resultado);

    });



  }).catch(error => {

    console.error(error);

  });

  selector_fecha_inicio = document.getElementById("fecha_inicio");
  selector_fecha_fin = document.getElementById("fecha_fin");
  establecerFechasDefecto();

}

function establecerFechasDefecto() {

  const fecha_actual = new Date(Date.now());
  const año = fecha_actual.getFullYear();
  const mes = String(fecha_actual.getMonth() + 1).padStart(2, '0'); //El método 'padStart' extiende el rango de caracteres las posiciones indicadas (2) hacia la izquierda con el carácter ('0') y devuelve el resultado.
  const mes_siguiente = String(fecha_actual.getMonth() + 2).padStart(2, '0');
  selector_fecha_inicio.value = `${año}-${mes}-01`;
  selector_fecha_fin.value = new Date(`${año}-${mes_siguiente}-${-1}`).toISOString().slice(0, 10);

}

function evaluarÍndice(nombre_índice) {

  switch (nombre_índice) {

    case "Peso":

      return " Kg."
      break;

    case "Glucosa":

      return " mg/dl."

    case "O2":

      return " %"

    case "Sist":

      return " mmHg."

    case "Diast":

      return " mmHg"

    case "PPM":

      return " ppm."

    case "Pasos":

      return " "

    case "Kms":

      return " kms."

    case "Cals":

      return " cal."

  }


}

function generarRegistrosEntabla(baseDeDatos, índices) {

  return new Promise((resolve, reject) => {


    leerTodosLosRegistros(baseDeDatos, "Mediciones").then(mapa_datos => {

      iterarMapaDeDatos(mapa_datos);

    });
    baseDeDatos.transaction("Mediciones", "readonly")
      .objectStore("Mediciones").count().onsuccess = (event) => {


        console.log(event.target.result);
        resolve(event.target.result);

      };

    índices.forEach((valor, índice) => {

      obtenerPromedios(baseDeDatos, "Mediciones", valor).then(resultado => {

        datos_promedios.rows[2].cells[índice].innerHTML = resultado + evaluarÍndice(valor);

      });


    });



  });





}

function iterarMapaDeDatos(mapa_datos) {


  for (let registro = 1; registro <= mapa_datos.size; registro++) {


    if (mapa_datos.get(registro).N == parseInt(idusuario_seleccionado)) {

      const nueva_fila = document.createElement('tr');
      nueva_fila.id = registro;
      tabla_datos.appendChild(nueva_fila);

      iterarCeldas(mapa_datos, registro, nueva_fila);
    }

  }

}


function iterarCeldas(mapa_datos, registro, fila) {

  let índices = Object.keys(mapa_datos.get(registro));

  for (let celda = 0; celda <= 12; celda++) {


    const nueva_celda = document.createElement('td');

    if (celda === 0) {

      nueva_celda.innerHTML = registro;
      fila.appendChild(nueva_celda);

    } else if (celda === 1 || celda === 2) {

      continue;

    } else if (celda === 3) {

      nueva_celda.innerHTML = mapa_datos.get(registro).Fecha.split("-")[2] + " / " +
        mapa_datos.get(registro).Fecha.split("-")[1] + " / " +
        mapa_datos.get(registro).Fecha.split("-")[0];
      fila.appendChild(nueva_celda);
    } else {

      let dato = mapa_datos.get(registro)[índices[celda]];
      nueva_celda.innerHTML = dato;
      fila.appendChild(nueva_celda);

    }

  }

}

