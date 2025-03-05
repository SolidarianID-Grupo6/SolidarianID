Handlebars.registerHelper('plusOne', function (index) {
    return index + 1;
});

Handlebars.registerHelper('calcPercentage', function (progress, goal) {
    if (goal === 0) return '0.00';
    return ((progress / goal) * 100).toFixed(2);
});

document.addEventListener('DOMContentLoaded', function () {
    const viewName = document.body.getAttribute('data-view');
  
    switch (viewName) {
      case 'statistics':
        renderChart1();
        renderChart2();
        renderChart3();
        renderChart4();
        break;
      case 'validation':
        fetchCommunitiesRequest();
        break;
      case 'information':
        fetchCommunities();
        break;
      default:
        console.log('Vista desconocida:', viewName);
    }
  });
  
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

async function loadTemplate(url) {
    const response = await fetch(url);
    return await response.text();
}

async function renderCommunities(communities) {
    const list = document.getElementById('comunidades-list');

    const templateSource = await loadTemplate('/templates/community-template.html');
    const template = Handlebars.compile(templateSource);

    communities.forEach(community => {
        const html = template(community);
        list.innerHTML += html;
    });
}

async function renderCommunitiesRequest(communities) {
    const list = document.getElementById('comunidades-request-list');

    const templateSource = await loadTemplate('/templates/community-request-template.html');
    const template = Handlebars.compile(templateSource);

    communities.forEach((community, index) => {
        community.requestDateFormatted = new Date(community.requestDate).toLocaleDateString();
        community.index = index; // Agrega el índice al objeto
        const html = template(community);
        list.innerHTML += html;
    });
}


const comunidadesRequestList = document.getElementById('comunidades-request-list');
if (comunidadesRequestList) {
    comunidadesRequestList.addEventListener('click', (event) => {
        const target = event.target;

        // Delegación para el botón de información
        if (target.closest('button[data-action="info"]')) {
            const index = target.closest('button[data-action="info"]').dataset.index;
            console.log(`Mostrar información de la comunidad con índice: ${index}`);
            showPopup(index);
        }

        // Delegación para el botón de rechazo
        if (target.closest('button[data-action="reject"]')) {
            const communityId = target.closest('button[data-action="reject"]').dataset.id;
            console.log(`Rechazar comunidad con ID: ${communityId}`);
            rejectCommunity(communityId);
        }
    });
}

async function showPopup(index) {
    if (!communities || index < 0 || index >= communities.length) {
        console.error('Índice fuera de rango o communities no definido');
        return;
    }

    const community = communities[index];

    community.requestDateFormatted = new Date(community.requestDate).toLocaleDateString();

    const templateSource = await loadTemplate('/templates/information-community-template.html');
    const template = Handlebars.compile(templateSource);

    const popupContent = template(community);

    document.getElementById('popupContent').innerHTML = popupContent;
    document.getElementById('detailsPopup').classList.remove('hidden');
}


// Cerrar el popup
function closePopup() {
    document.getElementById('detailsPopup').classList.add('hidden');
}

// Función para validar las solicitudes seleccionadas
async function validateSelectedCommunities() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked'); // Obtener los checkboxes seleccionados

    if (checkboxes.length === 0) {
        alert('Por favor, selecciona al menos una solicitud para validar.');
        return;
    }
    for (const checkbox of checkboxes) {
        const communityId = checkbox.id.split('-')[1];
        const community = communities.find(community => community.id == communityId);

        if (community) {
            try {
                const response = await fetch(`http://localhost:3001/community-requests/approve/${community.id}`, {
                    method: 'PUT',
                });

                if (!response.ok) {
                    console.log('Error en la solicitud:', response);
                    throw new Error(`Error aprobando la solicitud de creación de comunidad: ${response.statusText}`);
                }

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
        const response = await fetch(`http://localhost:3001/community-requests/reject/${communityId}`, {
            method: 'PUT',
        });

        if (!response.ok) {
            console.log('Error en la solicitud:', response);
            throw new Error(`Error rechazando la solicitud de creación de comunidad: ${response.statusText}`);
        }

        console.log(`Solicitud ${communityId} rechazada con éxito`);

    } catch (error) {
        console.error('Error al rechazar la solicitud:', error);
    }

    window.location.reload();
}

async function generateReport(communityName) {
    try {
        const response = await fetch(`http://localhost:3003/information/${communityName}`, {
            method: 'GET',
        });

        if (!response.ok) {
            console.error('Error en la solicitud:', response);
            throw new Error(`Error al generar el informe: ${response.statusText}`);
        }

        const data = await response.json();
        data.requestDateFormatted = new Date(data.requestDate).toLocaleDateString();

        const templateSource = await loadTemplate('/templates/report-template.html');
        const template = Handlebars.compile(templateSource);

        const reportContent = template(data);

        const reportView = document.getElementById('report-view');
        const reportContainer = document.getElementById('report-content');
        reportContainer.innerHTML = reportContent;
        reportView.classList.remove('hidden');

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

// Colores predefinidos
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
    const colors = [...predefinedColors];
    while (colors.length < count) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.5)`);
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
window.renderCommunities = renderCommunities;
window.validateSelectedCommunities = validateSelectedCommunities;
window.fetchCommunitiesRequest = fetchCommunitiesRequest;
window.fetchCommunities = fetchCommunities;
window.showPopup = showPopup;
window.closePopup = closePopup;
window.generateReport = generateReport;
window.rejectCommunity = rejectCommunity;