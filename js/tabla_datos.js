import { abrirDB, eliminarRegistro, leerUnRegistro, leerTodosLosRegistros, obtenerPromedios } from "./manejo_idb.mjs";

var idusuario_seleccionado = sessionStorage.getItem("id_usuario");
var nomusuario_barra_nav;
var tabla_datos;
var baseDeDatos;
var selector_fecha_inicio, selector_fecha_fin;
var datos_promedios, datos_totales;
var btnInicio, btnFormulario, btnGráfico, btnImprimir;
var div_grafico;
var categorías_eje_x_gráfico = [];
var conjunto_datos_peso = [];
var conjunto_datos_glucosa = [];
var conjunto_datos_o2 = [];
var conjunto_datos_sist = [];
var conjunto_datos_diast = [];
var conjunto_datos_ppm = [];
var img_enfermera;

window.onload = function () {


  setTimeout(() => {

    div_grafico.style.display = 'none';

  }, 50);

  nomusuario_barra_nav = document.getElementById("nomusuario_barra_nav");

  tabla_datos = document.getElementById("tabla_datos");
  datos_promedios = document.getElementById("datos_promedios");
  datos_totales = document.getElementById("datos_totales");
  btnInicio = document.getElementById("btnInicio");
  btnFormulario = document.getElementById("btnFormulario");
  btnGráfico = document.getElementById("btnGrafico");
  div_grafico = document.getElementById("div_grafico");
  btnImprimir = document.getElementById("btnImprimir");
  img_enfermera = document.getElementById("img_enfermera");

  btnImprimir.addEventListener("click", () => {

    window.print();

  });

  btnInicio.addEventListener("click", function () {

    window.location.href = "index.html";


  });

  btnFormulario.addEventListener("click", function () {

    let último_registro = tabla_datos.rows.length - 1;

    let valor_celda = tabla_datos.rows[último_registro].cells[0].innerText.split(" ")[0];

    sessionStorage.setItem("registro_edición", parseInt(valor_celda) + 1);

    window.location.href = "formulario_datos.html";

  });

  btnGráfico.addEventListener("click", function () {

  document.documentElement.requestFullscreen();
    if (btnGráfico.textContent === "Gráfico") {
      btnGráfico.textContent = "Tabla";
    } else {
      btnGráfico.textContent = "Gráfico";
    }


    if (div_grafico.style.display === 'none') {


      mostrarOcultarGráfico(1);
      crearGráfico();

    } else {

      mostrarOcultarGráfico(0);

    }


  });


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

    let titsección = document.getElementById("tit_sección");

    titsección.innerHTML = `INFORME: &emsp;(${invertirFecha(selector_fecha_inicio.value)} al ${invertirFecha(selector_fecha_fin.value)})`;
    let filas = tabla_datos.querySelectorAll('tr');

    filas.forEach(function (fila, i) {
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

    let titsección = document.getElementById("tit_sección");

    titsección.innerHTML = `INFORME: &emsp;(${invertirFecha(selector_fecha_inicio.value)} al ${invertirFecha(selector_fecha_fin.value)})`;
    filas.forEach(function (fila, i) {
      if (i != 0) {

        fila.parentNode.removeChild(fila);
      }
    });

    generarRegistrosEntabla(baseDeDatos).then(resultado => {

      console.log(resultado);

    });


  });

}

function diferenciaEnDías(fecha_inicio, fecha_fin) {

  var marca_temporal1 = new Date("2024-04-23").getTime();
  var marca_temporal2 = new Date("2024-04-28").getTime();

  var diferenciaEnMilisegundos = marca_temporal2 - marca_temporal1;

  var diferenciaEnDías = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

  return diferenciaEnDías;

}

function invertirFecha(fecha) {

  let día = fecha.split("-")[2];
  let mes = fecha.split("-")[1];
  let año = fecha.split("-")[0];

  return `${día}/${mes}/${año}`;

}

function establecerFechasDefecto() {

  // Obtener la fecha actual:
  const fecha_actual = new Date();

  // Obtener el año y el mes de la fecha actual:
  const año = fecha_actual.getFullYear();

  //Los meses están representados por una matriz (Array),
  //por lo que el mes de Abril (por ejemplo) tiene un índice '3' 
  //en la matriz.
  const mes = String(fecha_actual.getMonth() +1).padStart(2,'0'); // El método 'padStart' coloca
                                                                  // tantos caracteres a la izquierda
                                                                  // de la cadena como refleje el
                                                                  // valor entero del primer parámetro
                                                                  // del método. El segundo parámetro
                                                                  // especifica el carácter añadido.
  // Obtener el último día del mes actual:
  // (Al especificar el día '0' en el método constructor del objeto 'Date'
  // se obtiene el último día del mes. Así está definido en la API de 
  // JavaScript).
  const último_día_mes_actual = new Date(año,mes,0).getDate();

  selector_fecha_inicio.value = `${año}-${mes}-01`;
  selector_fecha_fin.value = `${año}-${mes}-${último_día_mes_actual}`;


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


        setTimeout(function () {

          let promedio_glucosa = parseInt(datos_promedios.rows[2].cells[1].innerText.split(" ")[0]);
          let promedio_o2 = parseInt(datos_promedios.rows[2].cells[2].innerText.split(" ")[0]);
          let promedio_sist = parseInt(datos_promedios.rows[2].cells[3].innerText.split(" ")[0]);
          let promedio_diast = parseInt(datos_promedios.rows[2].cells[4].innerText.split(" ")[0]);
          let promedio_ppm = parseInt(datos_promedios.rows[2].cells[5].innerText.split(" ")[0]);
          evaluar_dato(datos_promedios.rows[2].cells[1], promedio_glucosa, 70, 80, 100, 130);
          evaluar_dato(datos_promedios.rows[2].cells[2], promedio_o2, 93, 97, 100, 101);
          evaluar_dato(datos_promedios.rows[2].cells[3], promedio_sist, 80, 110, 150, 160);
          evaluar_dato(datos_promedios.rows[2].cells[4], promedio_diast, 50, 60, 80, 81);
          evaluar_dato(datos_promedios.rows[2].cells[5], promedio_ppm, 55, 60, 80, 120);

          mostrarEmociónEnfermera();

        }, 200
        );

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

function generarEjeXGráfico(tabla_html) {

  categorías_eje_x_gráfico = [];

  Array.from(tabla_html.rows).forEach(fila => {

    if (fila.rowIndex > 0) {

      categorías_eje_x_gráfico.push(fila.cells[1].innerText);
    }

  });

}

function incrustarDatosGráfico(tabla_html, id_col) {

  let promedio = 0;
  let contador = 0;

  Array.from(tabla_html.rows).forEach(fila => {

    if (fila.rowIndex > 0) {

      var contenido_celda = fila.cells[id_col].innerText;


      if (id_col === 2 && contenido_celda != "") {

        conjunto_datos_peso.push(contenido_celda);

      } else if (id_col === 3 && contenido_celda != "") {

        conjunto_datos_glucosa.push(contenido_celda);
      } else if (id_col === 4 && contenido_celda != "") {

        conjunto_datos_o2.push(contenido_celda);
      } else if (id_col === 5 && contenido_celda != "") {
        conjunto_datos_sist.push(contenido_celda);
      } else if (id_col === 6 && contenido_celda != "") {
        conjunto_datos_diast.push(contenido_celda);
      } else if (id_col === 7 && contenido_celda != "") {
        conjunto_datos_ppm.push(contenido_celda);
      }


    }

  });


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
    celda_editar.classList.add("no_imprimible");
    celda_eliminar.innerHTML = "<i class=\"fas fa-trash\"></i>";
    celda_eliminar.setAttribute('id', `elimi_${registro}`);
    celda_eliminar.classList.add("no_imprimible");
    

    celda_editar.addEventListener(('click'), () => {

      sessionStorage.setItem("registro_edición", registro);
      sessionStorage.setItem("opcInserción", registro);

      window.location.href = "formulario_datos.html";

    });

    celda_eliminar.addEventListener(('click'), () => {

      var registro_seleccionado = celda_eliminar.id.split("_")[1];
      sessionStorage.setItem("opcInserción", null);
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

function resaltarCelda(celda, tipo) {

  if (tipo === "normal") {

    celda.classList.remove("celda_ambar");
    celda.classList.remove("celda_roja");
    celda.classList.add("celda_verde");

  } else if (tipo === "precaución") {

    celda.classList.add("celda_ambar");
    celda.classList.remove("celda_roja");
    celda.classList.remove("celda_verde");

  } else if (tipo === "peligro") {

    celda.classList.remove("celda_ambar");
    celda.classList.add("celda_roja");
    celda.classList.remove("celda_verde");
  }


}

function evaluar_dato(celda, dato, límite1, límite2, límite3, límite4) {

  if ((dato < límite1) || dato > límite4) {

    resaltarCelda(celda, "peligro");

  } else if ((dato >= límite1) && (dato < límite2) || (dato >= límite3 && dato < límite4)) {

    resaltarCelda(celda, "precaución");

  } else if ((dato >= límite2) && (dato <= límite3)) {


    resaltarCelda(celda, "normal");
  }

}

function crearGráfico() {

  generarEjeXGráfico(tabla_datos);

  incrustarDatosGráfico(tabla_datos, 2);
  incrustarDatosGráfico(tabla_datos, 3);
  incrustarDatosGráfico(tabla_datos, 4);
  incrustarDatosGráfico(tabla_datos, 5);
  incrustarDatosGráfico(tabla_datos, 6);
  incrustarDatosGráfico(tabla_datos, 7);

  const etiquetas_X = Array.from(categorías_eje_x_gráfico);

  console.log(etiquetas_X);

  let graf = new Chart(`Evolución`, {
    type: "line",
    data: {
      labels: etiquetas_X,

      datasets: [{
        label: "Peso (Kg.)",
        data: conjunto_datos_peso,
        borderColor: "orange",
        fill: false,
        tension: 0
      }, {
        label: "Glucosa (mg/dL)",
        data: conjunto_datos_glucosa,
        borderColor: "green",
        fill: false,
        tension: 0
      }, {
        label: "Oxígeno En Sangre (%)",
        data: conjunto_datos_o2,
        borderColor: "cyan",
        fill: false,
        tension: 0
      }, {
        label: "Sístole (mmHg)",
        data: conjunto_datos_sist,
        borderColor: "red",
        fill: false,
        tension: 0
      }, {
        label: "Diástole (mmHg)",
        data: conjunto_datos_diast,
        borderColor: "blue",
        fill: false,
        tension: 0
      }, {
        label: "Frecuencia Cardíaca (ppm)",
        data: conjunto_datos_ppm,
        borderColor: "purple",
        fill: false,
        tension: 0
      }]

    },
    options: {
      animation: {
        duration: 5000
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: true, // Display vertical grid lines
            color:"teal",
            borderDash:[4,4,4]
          },


          ticks: {
            minRotation: 45,
            maxRotation: 45,
            fontSize: 18 // Set font size for x axis ticks
          }
        }],
        yAxes: [{

          gridLines:{
          display:true,
          color:"teal",
            borderDash:[4,4,4]
          },
          ticks: {
            fontSize: 18 // Set font size for y axis ticks
          }
        }]
      },

      title: {

        display: true,
        text: `${idusuario_seleccionado.slice(1, 50)}`,
        position: 'top',
        fontSize: 34
      },
      legend: {
        display: true,
        position: "right", labels: { fontSize: 16 }
      },
      spanGaps: true,


    }
  });


  return graf;
}

function actualizarGráfico(gráfico) {

  gráfico.update();



}

function mostrarOcultarGráfico(opción) {

  if (opción === 1) {

    div_grafico.style.display = 'flex';

  } else if (opción === 0) {

    div_grafico.style.display = 'none';
  }

}
function comprobarSiDatoAlterado() {


  for (let i = 0; i < 5; i++) {

    if (datos_promedios.rows[2].cells[i].classList.contains("celda_roja")) {

      return "recursos/img/Enfermera_Datos_Peligro.png";
    
    } else if (datos_promedios.rows[2].cells[i].classList.contains("celda_ambar")) {

      return "recursos/img/Enfermera_Datos_Precau.png";
    
    }

  }

  return "recursos/img/Enfermera_Datos.png";

}


function mostrarEmociónEnfermera() {

  img_enfermera.src = comprobarSiDatoAlterado();


}