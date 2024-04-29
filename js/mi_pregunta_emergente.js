
class PreguntaEmergente extends HTMLElement {

  constructor(textoTituloMens, mensaje, textoBtn, textoBtn2) {
    super();

    // Creación de la estructura HTML:
    this.innerHTML = `
        <div class="pregunta-emergente">
          <!-- Content goes here -->
          <div id="encabezado_mens_emergente">
          <h5 id="titulo_mens_emergente">${textoTituloMens}</h5>
            </div>

            <div id="div_mensaje">
               
                <h5 id="mensaje">${mensaje}</h5>
               <div style="display:flex;flex-direction:row;">
                <button type="button" id="btnSi" class="btn3d">${textoBtn}</button>
                <button type="button" id="btnNo" class="btn3d">${textoBtn2}</button>

               </div>
            </div>
          </div>
      `;

    var btnSi = this.querySelector('#btnSi');
    var contenedor = this.querySelector('.pregunta-emergente');
    var mensaje = this.querySelector('#mensaje');



    return this;

  }

}

// Define the custom element tag name
customElements.define('pregunta-emergente', PreguntaEmergente);
