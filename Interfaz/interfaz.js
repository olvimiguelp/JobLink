// Esperar a que la página cargue completamente
document.addEventListener('DOMContentLoaded', function() {
    // Selección de elementos del DOM
    const filterBtn = document.getElementById('filterBtn'); // Botón de filtro
    const helpBtn = document.getElementById('helpBtn'); // Botón de ayuda
    const profileBtn = document.getElementById('profileBtn'); // Botón de perfil
    const cardGrid = document.getElementById('cardGrid'); // Contenedor de tarjetas
  
    // Funcionalidad para el botón de filtro
    filterBtn.addEventListener('click', function() {
    });
  
    // Funcionalidad para el botón de ayuda
    helpBtn.addEventListener('click', function() {
    });
  
    // Funcionalidad para el botón de perfil
    profileBtn.addEventListener('click', function() {
    });
  
    // Generar dinámicamente las tarjetas
    function generateCards() {
      let cardHTML = '';
      for (let i = 1; i <= 8; i++) {
        cardHTML += `
          <div class="card">
            <img src="../imagen/Secciones.jpeg" alt="Icono usuario">
            <p>Tarjeta ${i}</p>
          </div>
        `;
      }
      cardGrid.innerHTML = cardHTML; // Agregar tarjetas al contenedor
    }
  
    // Llamar a la función para generar las tarjetas
    generateCards();
  });
  
  // Obtén los elementos necesarios
const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
const sidebar = document.querySelector('.sidebar');
const logo = document.getElementById('logo');


// Función para colapsar o expandir la barra lateral
function toggleSidebar() {
  sidebar.classList.toggle('collapsed');
}

// Detectar clic en el logo
logo.addEventListener('click', toggleSidebar);

// Agrega un evento al botón para abrir/cerrar la barra lateral
toggleSidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});
