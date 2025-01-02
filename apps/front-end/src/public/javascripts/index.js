// Función para mostrar el contenido de la pestaña seleccionada
function showTab(tabName) {
    // Primero ocultamos todos los contenidos de las pestañas
    const tabContents = document.querySelectorAll('.tabcontent');
    tabContents.forEach(function(content) {
      content.classList.add('hidden'); // Se ocultan todos
    });
  
    // Luego mostramos la pestaña seleccionada
    const selectedTab = document.getElementById(tabName);
    selectedTab.classList.remove('hidden'); // Mostramos la pestaña activa
  }
  
  // Configuramos la pestaña 'validacion' como la predeterminada cuando se carga la página
  window.onload = function() {
    showTab('validacion'); // Muestra la pestaña de validación por defecto
  };
  