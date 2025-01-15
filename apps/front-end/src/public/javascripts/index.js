
// Función para mostrar el contenido de la pestaña seleccionada
function showTab(tabName, element) {
    console.log(`Mostrando pestaña: ${tabName}`);
    const tabContents = document.querySelectorAll('.tabcontent');
    tabContents.forEach(content => content.classList.add('hidden')); // Ocultar todos
    document.getElementById(tabName).classList.remove('hidden'); // Mostrar el seleccionado

    // Remueve la clase 'active' de todos los enlaces
    const tabs = document.querySelectorAll('nav a');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Añade la clase 'active' al enlace actual
    element.classList.add('active');

    if (tabName === 'validacion') {
        fetchCommunitiesRequest();
    }

    if (tabName === 'estadisticas') {
        renderChart1();
        renderChart2();
        renderChart3();
        renderChart4();
    }

    if (tabName === 'informes') {
        fetchCommunities();
    }
}

let communities = [];

async function fetchCommunitiesRequest() {
    try {
        const response = await fetch('http://localhost:3001/community-requests');
        if (!response.ok) {
            console.log('Error en la solicitud:', response);
            throw new Error(`Error al obtener comunidades: ${response.statusText}`);
        }

        communities = await response.json();
        renderCommunitiesRequest(communities);
    } catch (error) {
        console.error(error);
        document.getElementById('comunidades-request-list').innerHTML = `
      <p class="text-red-500">Error al cargar las comunidades.</p>
    `;
    }
}

async function fetchCommunities() {
    try {
        const response = await fetch('http://localhost:3003/information');
        if (!response.ok) {
            console.log('Error en la solicitud:', response);
            throw new Error(`Error al obtener comunidades: ${response.statusText}`);
        }

        communities = await response.json();
        renderCommunities(communities);
    } catch (error) {
        console.error(error);
        document.getElementById('comunidades-list').innerHTML = `
      <p class="text-red-500">Error al cargar las comunidades.</p>
    `;
    }
}

function renderCommunities(communities) {
    const list = document.getElementById('comunidades-list');
    list.innerHTML = ''; // Limpiar contenido previo

    communities.forEach((community, index) => {
        const item = `
  <div class="flex flex-col sm:flex-row items-center p-4 sm:p-6 bg-gray-50 shadow-md rounded-lg max-w-full mx-auto">
    <!-- Contenedor principal dividido en dos secciones -->
    <div class="flex-1 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
      <!-- Nombre de la Comunidad -->
      <h3 class="text-base sm:text-lg font-bold text-gray-700">Comunidad:</h3>
      <p class="text-sm sm:text-base text-gray-600">${community.name}</p>
    </div>

    <!-- Botones -->
    <div class="mt-4 sm:mt-0 flex items-center justify-center space-x-2">
      <button 
        class="bg-cyan-500 hover:bg-cyan-700 text-white px-3 sm:px-4 py-1 sm:py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
        onclick="generateReport('${community.name}')">
        Obtener informe de comunidad
      </button>
    </div>
  </div>
`;

        list.innerHTML += item;
    });
}

function renderCommunitiesRequest(communities) {
    const list = document.getElementById('comunidades-request-list');
    list.innerHTML = ''; // Limpiar contenido previo

    communities.forEach((community, index) => {
        const item = `
  <div class="flex items-center p-2 sm:p-4 bg-gray-50 shadow-md rounded-lg sm:max-w-full max-w-lg mx-auto">
    <!-- Checkbox al lado izquierdo -->
    <input type="checkbox" class="mr-2 sm:mr-4 self-center" id="community-${community.id}" data-index="${index}">

    <!-- Contenedor dividido en tres columnas -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 flex-1">
      <!-- Columna 1: Nombre y Descripción -->
      <div class="sm:text-left text-center">
        <h3 class="text-base sm:text-lg font-bold">Nombre: ${community.name}</h3>
        <p class="text-xs sm:text-sm text-gray-600">Descripción: ${community.description}</p>
      </div>

      <!-- Columna 2: Fecha -->
      <div class="flex items-center justify-center">
        <p class="text-xs sm:text-sm text-gray-600">Fecha de la solicitud: ${new Date(community.requestDate).toLocaleDateString()}</p>
      </div>

      <!-- Columna 3: Botones -->
      <div class="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
        <button type="button" class="text-white bg-cyan-500 hover:bg-cyan-700 focus:ring-4 font-medium rounded-full text-xs sm:text-sm p-2 sm:p-2.5 text-center inline-flex items-center me-1 sm:me-2" data-action="info" data-index="${index}">
          <img src="/images/info-icon.png" alt="Info" class="w-4 h-4 sm:w-5 sm:h-5">
        </button>
        <button class="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-600" data-action="reject" data-id="${community.id}">
          Rechazar
        </button>
      </div>
    </div>
  </div>
`;

        list.innerHTML += item;
    });
}

// Delegación de eventos en el contenedor principal
document.getElementById('comunidades-request-list').addEventListener('click', (event) => {
    const target = event.target;

    // Delegación para el botón de información
    if (target.closest('button[data-action="info"]')) {
        const index = target.closest('button[data-action="info"]').dataset.index;
        console.log(`Mostrar información de la comunidad con índice: ${index}`);
        showPopup(index); // Llama a la función existente
    }

    // Delegación para el botón de rechazo
    if (target.closest('button[data-action="reject"]')) {
        const communityId = target.closest('button[data-action="reject"]').dataset.id;
        console.log(`Rechazar comunidad con ID: ${communityId}`);
        rejectCommunity(communityId); // Llama a la función existente
    }
});


// Mostrar el popup con los detalles de la solicitud
function showPopup(index) {
    const community = communities[index];

    const popupContent = `
  <div class="max-w-[30rem] sm:max-w-[40rem] mx-auto p-4 bg-white rounded-lg shadow-lg">
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
      <p class="font-bold text-gray-700">ID:</p>
      <p class="text-gray-600 break-words">${community.id}</p>

      <p class="font-bold text-gray-700">Nombre:</p>
      <p class="text-gray-600">${community.name}</p>

      <p class="font-bold text-gray-700">Descripción:</p>
      <p class="text-gray-600">${community.description || 'Sin descripción'}</p>

      <p class="font-bold text-gray-700">Fecha de Solicitud:</p>
      <p class="text-gray-600">${new Date(community.requestDate).toLocaleDateString()}</p>

      <p class="font-bold text-gray-700">Estado:</p>
      <p class="text-gray-600">${community.status}</p>

      <p class="font-bold text-gray-700">Causas:</p>
      <p class="text-gray-600">${community.causes.map(cause => `<span>${cause.title}</span>`).join(', ')}</p>

      <p class="font-bold text-gray-700">Creador:</p>
      <p class="text-gray-600">${community.creator}</p>
    </div>
  </div>
`;




    document.getElementById('popupContent').innerHTML = popupContent;
    document.getElementById('detailsPopup').classList.remove('hidden');
}

// Cerrar el popup
function closePopup() {
    document.getElementById('detailsPopup').classList.add('hidden');
}

// Función para validar las solicitudes seleccionadas
// Crear una función async para manejar la validación
async function validateSelectedCommunities() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); // Obtener los checkboxes seleccionados

    if (checkboxes.length === 0) {
        alert('Por favor, selecciona al menos una solicitud para validar.');
        return;
    }
    // Usamos un for...of en lugar de forEach para que funcione con await
    for (const checkbox of checkboxes) {
        const communityId = checkbox.id.split('-')[1]; // Obtener el ID de la comunidad desde el id del checkbox
        const community = communities.find(community => community.id == communityId); // Buscar la comunidad correspondiente en el array

        if (community) {
            try {
                // Hacer la solicitud fetch para cada comunidad seleccionada
                const response = await fetch(`http://localhost:3001/community-requests/approve/${community.id}`, {
                    method: 'PUT', // O el método adecuado según tu API, 'POST' o 'DELETE', etc.
                });

                if (!response.ok) {
                    console.log('Error en la solicitud:', response);
                    throw new Error(`Error aprobando la solicitud de creación de comunidad: ${response.statusText}`);
                }

                // Si la respuesta es exitosa, puedes agregar un mensaje o actualizar la UI si es necesario
                console.log(`Solicitud ${community.id} aprobada con éxito`);

            } catch (error) {
                console.error('Error al aprobar la solicitud:', error);
            }
        }

        window.location.reload();
    }
}


// Función para rechazar una solicitud
async function rejectCommunity(communityId) {
    console.log('Rechazar solicitud con ID:', communityId);

    try {
        // Hacer la solicitud fetch para rechazar la comunidad con el communityId
        const response = await fetch(`http://localhost:3001/community-requests/reject/${communityId}`, {
            method: 'PUT', // Asumiendo que es un método PUT para rechazar la solicitud
        });

        if (!response.ok) {
            console.log('Error en la solicitud:', response);
            throw new Error(`Error rechazando la solicitud de creación de comunidad: ${response.statusText}`);
        }

        // Si la respuesta es exitosa, puedes agregar un mensaje o actualizar la UI si es necesario
        console.log(`Solicitud ${communityId} rechazada con éxito`);

    } catch (error) {
        console.error('Error al rechazar la solicitud:', error);
    }

    window.location.reload();
}

async function generateReport(communityName) {
    try {
        // Realizar la solicitud al servidor
        const response = await fetch(`http://localhost:3003/information/${communityName}`, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error('Error en la solicitud:', response);
            throw new Error(`Error al generar el informe: ${response.statusText}`);
        }

        // Obtener datos de la comunidad
        const data = await response.json();

        // Crear el contenido HTML para el informe
        const reportContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: justify; margin: 20px;">
        <p><strong>Nombre de la Comunidad:</strong> ${data.name}</p>
        <p><strong>Número Total de Miembros:</strong> ${data.total_members}</p>
        <p><strong>ODS de la Comunidad:</strong> ${[
                ...new Set(data.causes.flatMap((cause) => cause.ods)),
            ].join(', ')}</p>
        
        <h2 style="font-size: 20px; margin-top: 20px;">Causas de la Comunidad:</h2>
        <ol style="padding-left: 20px;">
          ${data.causes
                .map(
                    (cause, causeIndex) => `
              <li style="margin-bottom: 20px;">
                <strong>${causeIndex + 1}. Título de la Causa:</strong> ${cause.title} <br />
                <strong>ODS Relacionados:</strong> ${cause.ods.join(', ')} <br />
                <strong>Apoyos Totales:</strong> ${cause.total_supporters} <br />
                ${cause.actions.length > 0
                            ? `
                    <h3 style="margin-top: 10px; font-size: 18px;">Acciones Relacionadas:</h3>
                    <ol style="padding-left: 20px;">
                      ${cause.actions
                                .map(
                                    (action, actionIndex) => `
                          <li>
                            <strong>${causeIndex + 1}.${actionIndex + 1} Acción:</strong> ${action.title} <br />
                            <strong>Descripción:</strong> ${action.description} <br />
                            <strong>Meta:</strong> ${action.goal} <br />
                            <strong>Progreso:</strong> ${action.progress} (${(
                                            (action.progress / action.goal) *
                                            100
                                        ).toFixed(2)}%)
                          </li>
                        `
                                )
                                .join('')}
                    </ol>`
                            : `<p><em>Sin acciones relacionadas.</em></p>`
                        }
              </li>
            `
                )
                .join('')}
        </ol>
      </div>
    `;

        const reportView = document.getElementById('report-view');
        const reportContainer = document.getElementById('report-content');
        reportContainer.innerHTML = reportContent;

        // Mostrar el modal
        reportView.classList.remove('hidden');

        // Configurar el botón para descargar el PDF
        const downloadButton = document.getElementById('download-pdf');
        downloadButton.onclick = () => {
            const options = {
                margin: 5,
                filename: `${communityName}-informe.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };
            html2pdf().set(options).from(reportContainer).save();
        };

        const closeButton = document.getElementById('close-report');
        closeButton.onclick = () => {
            reportView.classList.add('hidden');
        };
    } catch (error) {
        console.error('Error al generar el informe:', error);
    }
}


window.onload = function () {
    // Configurar eventos delegados para la lista de comunidades
    document.getElementById('comunidades-request-list').addEventListener('click', (event) => {
      const target = event.target;
  
      if (target.matches('button[data-action="reject"]')) {
        const communityId = target.dataset.id;
        console.log(`Rechazar comunidad con ID: ${communityId}`);
        rejectCommunity(communityId); // Llama a la función de rechazo
      }
    });
  
    // Configuración adicional para otras secciones de la página
    fetchCommunitiesRequest();
  };

const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const menuContent = document.getElementById('menuContent');
        if (menuContent && window.innerWidth < 640) {
            menuContent.classList.toggle('hidden'); // Alternar entre mostrar y ocultar el menú
        }
    });
}

async function fetchData(endpoint) {
    try {
        const response = await fetch(`http://localhost:3003/statistics/${endpoint}`, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Error al obtener datos de ${endpoint}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Colores predefinidos (alegres y vistosos)
const predefinedColors = [
    'rgba(255, 99, 132, 0.5)',  // Rojo vibrante
    'rgba(54, 162, 235, 0.5)',  // Azul brillante
    'rgba(255, 206, 86, 0.5)',  // Amarillo cálido
    'rgba(75, 192, 192, 0.5)',  // Verde menta
    'rgba(153, 102, 255, 0.5)', // Morado
    'rgba(255, 159, 64, 0.5)',  // Naranja brillante
    'rgba(255, 205, 86, 0.5)',  // Amarillo claro
    'rgba(77, 83, 96, 0.5)',    // Gris oscuro
    'rgba(201, 203, 255, 0.5)', // Azul pastel
    'rgba(253, 107, 25, 0.5)',  // Naranja fuerte
];

// Función para generar colores dinámicamente si es necesario
const generateColors = (count) => {
    const colors = [...predefinedColors]; // Comienza con los colores predefinidos
    while (colors.length < count) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`); // Agrega colores dinámicos con transparencia
    }
    return colors;
};

// Función genérica para obtener datos de un endpoint
async function fetchChartData(endpoint) {
    try {
        const data = await fetchData(endpoint);
        console.log(`Datos recibidos de ${endpoint}:`, data);
        return data;
    } catch (error) {
        console.error(`Error obteniendo datos de ${endpoint}:`, error);
        return null;
    }
}

let chart1Instance = null;
let chart2Instance = null;
let chart3Instance = null;
let chart4Instance = null;

// Gráfico combinado (Barras y Líneas)
async function renderChart1() {
    const comunidadesData = await fetchChartData('getCommunitiesByODS');
    const causasData = await fetchChartData('getCausesByODS');

    if (comunidadesData && causasData) {
        const labels = Object.keys(comunidadesData);
        const comunidadesValues = labels.map(label => comunidadesData[label] || 0);
        const causasValues = labels.map(label => causasData[label] || 0);

        if (chart1Instance) {
            chart1Instance.destroy();
        }

        const ctx1 = document.getElementById('chart1').getContext('2d');
        chart1Instance = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Comunidades por ODS',
                        data: comunidadesValues,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Causas por ODS',
                        data: causasValues,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 2,
                        type: 'line',
                        fill: false,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
                scales: {
                    y: { beginAtZero: true },
                },
            },
        });
    }
}

// Gráfico de Tarta (Apoyos por ODS)
async function renderChart2() {
    const data = await fetchChartData('getSupportByODS');

    if (data) {
        const labels = Object.keys(data);
        const values = Object.values(data);
        const colors = generateColors(labels.length);

        if (chart2Instance) {
            chart2Instance.destroy();
        }

        const ctx2 = document.getElementById('chart2').getContext('2d');
        chart2Instance = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
            },
        });
    }
}

// Gráfico de Tarta (Porcentaje de Apoyos por Comunidad)
async function renderChart3() {
    const data = await fetchChartData('getSupportByCommunity');

    if (data) {
        const labels = Object.keys(data);
        const values = Object.values(data);

        if (values.every(value => value === 0)) {
            console.warn('No hay datos para mostrar en el gráfico.');
            return;
        }

        if (chart3Instance) {
            chart3Instance.destroy();
        }

        const colors = generateColors(labels.length);
        const ctx3 = document.getElementById('chart3').getContext('2d');
        chart3Instance = new Chart(ctx3, {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
            },
        });
    }
}

// Ejemplo de uso en una gráfica
async function renderChart4() {


    const data = await fetchChartData('getProgressByCommunity');

    if (data) {
        const labels = [];
        const values = [];

        // Procesar los datos
        Object.entries(data).forEach(([community, actions]) => {
            if (actions.length > 0) {
                const totalProgress = actions.reduce((sum, action) => sum + action.percentageComplete, 0);
                labels.push(community);
                values.push(totalProgress);
            }
        });

        // Verificar si hay datos
        if (values.every(value => value === 0)) {
            console.warn('Todos los valores son cero. No se puede mostrar el gráfico.');
            return;
        }

        // Generar colores
        const colors = generateColors(labels.length);

        if (chart4Instance) {
            chart4Instance.destroy();
        }

        // Crear el gráfico
        const ctx4 = document.getElementById('chart4').getContext('2d');
        chart4Instance = new Chart(ctx4, {
            type: 'polarArea',
            data: {
                labels,
                datasets: [{
                    data: values,
                    backgroundColor: colors,
                }],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                },
                scales: {
                    r: { ticks: { beginAtZero: true } },
                },
            },
        });
    }
}

// Exponer las funciones al ámbito global
window.showTab = showTab;
window.renderCommunities = renderCommunities;
window.validateSelectedCommunities = validateSelectedCommunities;
window.fetchCommunitiesRequest = fetchCommunitiesRequest;
window.fetchCommunities = fetchCommunities;
window.showPopup = showPopup;
window.closePopup = closePopup;
window.generateReport = generateReport;
window.rejectCommunity = rejectCommunity;