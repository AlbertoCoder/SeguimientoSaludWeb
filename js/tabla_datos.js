import { abrirDB, eliminarRegistro, leerUnRegistro, leerTodosLosRegistros, obtenerPromedios } from "./manejo_idb.mjs";

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
var datos_promedios, datos_totales;

window.onload = function() {

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  tabla_datos = document.getElementById("tabla_datos");
  datos_promedios = document.getElementById("datos_promedios");
  datos_totales = document.getElementById("datos_totales");

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

  selector_fecha_inicio.addEventListener('change', () => {

    let filas = tabla_datos.querySelectorAll('tr');

    filas.forEach(function(fila, i) {
      if (i != 0) {

        fila.parentNode.removeChild(fila);
      }
    });

    generarRegistrosEntabla(baseDeDatos).then(resultado => {

      console.log(resultado);

    });



  });

  selector_fecha_fin.addEventListener('change', () => {

    let filas = tabla_datos.querySelectorAll('tr');

    filas.forEach(function(fila, i) {
      if (i != 0) {

        fila.parentNode.removeChild(fila);
      }
    });

    generarRegistrosEntabla(baseDeDatos).then(resultado => {

      console.log(resultado);

    });



  });

}

function establecerFechasDefecto() {

  const fecha_actual = new Date(Date.now());
  const año = fecha_actual.getFullYear();
  const mes = String(fecha_actual.getMonth() + 1).padStart(2, '0'); //El método 'padStart' extiende el rango de caracteres las posiciones indicadas (2) hacia la izquierda con el carácter ('0') y devuelve el resultado.
  const mes_siguiente = String(fecha_actual.getMonth() + 2).padStart(2, '0');
  selector_fecha_inicio.value = `${año}-${mes}-01`;
  selector_fecha_fin.value = new Date(`${año}-${mes_siguiente}-${-1}`).toISOString().slice(0, 10);

}


function generarRegistrosEntabla(baseDeDatos) {

  return new Promise((resolve, reject) => {

    leerTodosLosRegistros(baseDeDatos, "Mediciones").then(mapa_datos => {

      iterarMapaDeDatos(mapa_datos, selector_fecha_inicio.value, selector_fecha_fin.value);

    });

    baseDeDatos.transaction("Mediciones", "readonly")
      .objectStore("Mediciones").count().onsuccess = (event) => {

        console.log(event.target.result);
        resolve(event.target.result);
        reject("No se pudo.");

      };

  });

}

function iterarMapaDeDatos(mapa_datos, fecha_inicio, fecha_fin) {

  Array.from(mapa_datos).forEach((registro => {

    console.log(mapa_datos);

    if (registro[1].N == parseInt(idusuario_seleccionado) && (registro[1].Fecha >= fecha_inicio && registro[1].Fecha <= fecha_fin)) {

      const nueva_fila = document.createElement('tr');
      nueva_fila.id = registro;
      tabla_datos.appendChild(nueva_fila);

      iterarCeldas(mapa_datos, registro[0], nueva_fila);
    }

  }));

}

function obtenerPromedio(tabla_html, id_col) {

  let promedio = 0;
  let contador = 0;
  Array.from(tabla_html.rows).forEach(fila => {

    if (fila.rowIndex > 0) {

      let contenido_celda = fila.cells[id_col].innerText;

      if (contenido_celda != "") {

        contador++;
        promedio += parseFloat(contenido_celda);

      }

    }

  });

  return Math.round((promedio / contador));

}

function obtenerTotales(tabla_html, id_col) {

  let total = 0;
  let contador = 0;
  Array.from(tabla_html.rows).forEach(fila => {

    if (fila.rowIndex > 0) {
      let contenido_celda = fila.cells[id_col].innerText;

      if (contenido_celda != "") {

        contador++;
        total += parseFloat(contenido_celda);

      }

    }

  });

  return total;

}

function iterarCeldas(mapa_datos, registro, fila) {

  let índices = Object.keys(mapa_datos.get(registro));

  for (let celda = 0; celda <= 14; celda++) {

    const nueva_celda = document.createElement('td');
    const celda_editar = document.createElement('td');
    const celda_eliminar = document.createElement('td');
    celda_editar.innerHTML = "<i class=\"fas fa-edit\"></i>";
    celda_editar.setAttribute('id', `edit_${registro}`);
    celda_eliminar.innerHTML = "<i class=\"fas fa-trash\"></i>";
    celda_eliminar.setAttribute('id', `elimi_${registro}`);


    celda_editar.addEventListener(('click'), () => {

      sessionStorage.setItem("registro_edición", registro);


      window.location.href = "formulario_datos.html";

    });

    celda_eliminar.addEventListener(('click'), () => {

      var registro_seleccionado = celda_eliminar.id.split("_")[1];

      eliminarRegistro(baseDeDatos, "Mediciones", registro_seleccionado).then(resultado => {


        alert("Eliminado correctamente.");

        location.reload();

      });



    });

    if (celda === 0) {

      nueva_celda.innerHTML = registro;
      fila.appendChild(nueva_celda);

    } else if (celda === 1 || celda === 2) {

      continue;

    } else if (celda === 3) {

      nueva_celda.innerHTML = mapa_datos.get(registro).Fecha.split("-")[2] + "/" +
        mapa_datos.get(registro).Fecha.split("-")[1] + "/" +
        mapa_datos.get(registro).Fecha.split("-")[0];
      fila.appendChild(nueva_celda);

    } else if (celda === 13) {

      fila.appendChild(celda_editar);
    } else if (celda === 14) {


      fila.appendChild(celda_eliminar);

    } else {

      let dato = mapa_datos.get(registro)[índices[celda]];


      nueva_celda.innerHTML = dato;

      evaluar_dato(celda, nueva_celda, dato);
      evaluar_dato(1, datos_promedios.rows[2].cells[1], dato);

      fila.appendChild(nueva_celda);

    }


  }


  datos_promedios.rows[2].cells[0].innerText = obtenerPromedio(tabla_datos, 2) + " Kg.";
  datos_promedios.rows[2].cells[1].innerText = obtenerPromedio(tabla_datos, 3) + " mg/dl";
  datos_promedios.rows[2].cells[2].innerText = obtenerPromedio(tabla_datos, 4) + " %";
  datos_promedios.rows[2].cells[3].innerText = obtenerPromedio(tabla_datos, 5) + " mmHg";
  datos_promedios.rows[2].cells[4].innerText = obtenerPromedio(tabla_datos, 6) + " mmHg";
  datos_promedios.rows[2].cells[5].innerText = obtenerPromedio(tabla_datos, 7);
  datos_promedios.rows[2].cells[6].innerText = obtenerPromedio(tabla_datos, 8);
  datos_promedios.rows[2].cells[7].innerText = obtenerPromedio(tabla_datos, 9);
  datos_promedios.rows[2].cells[8].innerText = obtenerPromedio(tabla_datos, 10);

  datos_totales.rows[2].cells[0].innerText = obtenerTotales(tabla_datos, 8);
  datos_totales.rows[2].cells[1].innerText = obtenerTotales(tabla_datos, 9);
  datos_totales.rows[2].cells[2].innerText = obtenerTotales(tabla_datos, 10);


}

function evaluar_dato(num_celda, celda, dato) {


  if (num_celda === 1) {

    if (dato < 70) {

      celda.classList.add("celda_roja");

    } else if (dato >= 70 && dato < 100) {

      celda.classList.add("celda_verde");

    } else {

      celda.classList.add("celda_roja");

    }

  }


}
