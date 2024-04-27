class MensEmergente extends HTMLElement {
    
    constructor(mensaje) {
      super();
      // Initialization code goes here
  
      // Create the HTML structure
      this.innerHTML = `
        <div class="mens-emergente">
          <!-- Content goes here -->
          <div id="encabezado_mens_emergente">
          <h5 id="titulo_mens_emergente">Información</h5>
            </div>

            <div id="div_mensaje">
                
                <h5 id="mensaje">${mensaje}</h5>
                <button type="button" class="btnVale">¡Vale!</button>
            </div>
          </div>
      `;
        var btnVale = this.querySelector('.btnVale');
        var contenedor = this.querySelector('.mens-emergente');
        var mensaje = this.querySelector('#mensaje');

        btnVale.addEventListener("click",()=>{

            contenedor.style.display = "none";
            location.reload();
        });
    }
}
  
  // Define the custom element tag name
  customElements.define('mens-emergente', MensEmergente);
