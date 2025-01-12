describe('SolidarianID E2E Tests - Validación y Rechazo de Solicitudes', () => {
  const mockRequestData = {
    name: "Solicitud numero distinto",
    description: "Descripción de prueba",
    creator: 1,
    causes: [
      {
        title: "Cause Title",
        description: "Cause Description",
        endDate: "2024-12-31T23:59:59.000Z",
        ods: ["Hambre cero"]
      },
      {
        title: "Another Cause",
        description: "Another Description",
        endDate: "2024-12-31T23:59:59.000Z",
        ods: ["Hambre cero"]
      }
    ]
  };

  beforeEach(() => {
    // Configuración para manejar errores cross-origin
    cy.on('uncaught:exception', () => false);

    // Interceptar la petición antes de visitar la página
    cy.intercept('GET', '/community-requests*', {
      statusCode: 200,
      body: [mockRequestData]
    }).as('fetchCommunities');

    cy.intercept('GET', 'http://localhost:3001/community-requests/', {
      statusCode: 200,
      body: [mockRequestData]
    }).as('fetchCommunities');

    cy.intercept('PUT', '**/community-requests/reject/*', {
      statusCode: 200
    }).as('rejectRequest');

    // Visitar la página después de configurar los interceptores
    cy.visit('http://localhost:3004', {
      onBeforeLoad(win) {
        Object.defineProperty(win, 'crossOriginIsolated', {
          value: true
        });
      }
    });
  });

  it('Debe cargar correctamente el panel administrativo', () => {
    // Interceptar la petición inicial

    // Visitar la página
    cy.visit('http://localhost:3004');

    // Verificar elementos principales
    cy.get('h1').contains('SolidarianID');
    cy.contains('Administrador');
    cy.wait('@fetchCommunities');
    cy.contains(mockRequestData.name);
  });

  it('Debe mostrar correctamente los detalles de una solicitud', () => {
    cy.wait('@fetchCommunities');;
    cy.get('button[type="button"]').first().click();

    // Verificar que el popup se muestra con la información correcta
    cy.get('#detailsPopup').should('not.have.class', 'hidden');
    cy.get('#popupContent').within(() => {
      cy.contains(mockRequestData.name);
      cy.contains(mockRequestData.description);
      cy.contains(mockRequestData.causes[0].title);
    });

    // Verificar que se puede cerrar el popup
    cy.contains('button', 'Cerrar').click();
    cy.get('#detailsPopup').should('have.class', 'hidden');
  });

  it('Debería rechazar una solicitud específica', () => {
    cy.wait('@fetchCommunities');
    cy.get('button').contains('Rechazar').first().click();
    cy.wait('@rejectRequest');
  });


});
