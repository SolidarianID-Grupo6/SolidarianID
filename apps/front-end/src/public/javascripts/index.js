// Función para mostrar el contenido de la pestaña seleccionada
function showTab(tabName) {
  const tabContents = document.querySelectorAll('.tabcontent');
  tabContents.forEach(content => content.classList.add('hidden')); // Ocultar todos
  document.getElementById(tabName).classList.remove('hidden'); // Mostrar el seleccionado
}

// Cargar comunidades al iniciar la página
async function fetchCommunities() {
  try {
    const response = await fetch('http://localhost:3001/communities');
    if (!response.ok) {
      throw new Error(`Error al obtener comunidades: ${response.statusText}`);
    }
    const communities = await response.json();
    renderCommunities(communities);
  } catch (error) {
    console.error(error);
    document.getElementById('comunidades-list').innerHTML = `
      <p class="text-red-500">Error al cargar las comunidades.</p>
    `;
  }
}

// Renderizar comunidades en la lista
function renderCommunities(communities) {
  const list = document.getElementById('comunidades-list');
  list.innerHTML = ''; // Limpiar contenido previo
  communities.forEach((community, index) => {
    const item = `
      <div class="solicitud-item flex items-center justify-between p-4 bg-gray-50 shadow-md rounded">
        <div>
          <h3 class="text-lg font-bold">Solicitud ${index + 1}: ${community.name}</h3>
          <p class="text-sm text-gray-600">${community.description || 'Sin descripción'}</p>
        </div>
        <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Rechazar
        </button>
      </div>
    `;
    list.innerHTML += item;
  });
}

// Configurar la pestaña predeterminada y cargar datos
window.onload = function() {
  showTab('validacion'); // Mostrar la pestaña de validación
  fetchCommunities(); // Llamar al backend para cargar las comunidades
};
