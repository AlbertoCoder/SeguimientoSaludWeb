class MensEmergente extends HTMLElement {

  constructor(textoTituloMens, mensaje, textoBtn) {
    super();

    // Creación de la estructura HTML:
    this.innerHTML = `
        <div class="mens-emergente">
          <!-- Content goes here -->
          <div id="encabezado_mens_emergente">
          <h5 id="titulo_mens_emergente">${textoTituloMens}</h5>
            </div>

            <div id="div_mensaje">
                
                <h5 id="mensaje">${mensaje}</h5>
                <button type="button" class="btn3d texto_perimetrado">${textoBtn}</button>
            </div>
          </div>
      `;
    var btn3d = this.querySelector('.btn3d');
    var contenedor = this.querySelector('.mens-emergente');
    var mensaje = this.querySelector('#mensaje');

    btn3d.addEventListener("click", () => {

      contenedor.style.display = "none";
      location.reload();
    });
  }
}

// Define the custom element tag name
customElements.define('mens-emergente', MensEmergente);
