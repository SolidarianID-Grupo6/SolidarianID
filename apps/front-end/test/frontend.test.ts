import '@testing-library/jest-dom';
import { screen, fireEvent } from '@testing-library/dom';
require('../src/public/javascripts/index.js');

import fs from 'fs';

beforeEach(() => {
  document.body.innerHTML = `
    <nav>
    <a id="tab-validacion" href="#" onclick="showTab('validacion', this)">Validación</a>
    <a id="tab-estadisticas" href="#" onclick="showTab('estadisticas', this)">Estadísticas</a>
    <a id="tab-informes" href="#" onclick="showTab('informes', this)">Informes</a>
    </nav>
    <div id="validacion" class="tabcontent">Contenido Validación</div>
    <div id="estadisticas" class="tabcontent hidden">Contenido Estadísticas</div>
    <div id="informes" class="tabcontent hidden">Contenido Informes</div>
`;
});

describe('Cambio de pestañas', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav>
        <a id="tab-validacion" href="#" onclick="showTab('validacion', this)">Validación</a>
        <a id="tab-estadisticas" href="#" onclick="showTab('estadisticas', this)">Estadísticas</a>
        <a id="tab-informes" href="#" onclick="showTab('informes', this)">Informes</a>
      </nav>
      <div id="validacion" class="tabcontent">Contenido Validación</div>
      <div id="estadisticas" class="tabcontent hidden">Contenido Estadísticas</div>
      <div id="informes" class="tabcontent hidden">Contenido Informes</div>
    `;
  });

  it('Debe mostrar la pestaña "Estadísticas" y ocultar las demás', () => {
    const estadisticasTab = document.getElementById('tab-estadisticas');
    const estadisticasContent = document.getElementById('estadisticas');
    const validacionContent = document.getElementById('validacion');
    const informesContent = document.getElementById('informes');

    // Simula el clic
    estadisticasTab.click();

    // Verifica que "Estadísticas" esté visible
    expect(estadisticasContent).not.toHaveClass('hidden');

    // Verifica que las demás estén ocultas
    expect(validacionContent).toHaveClass('hidden');
    expect(informesContent).toHaveClass('hidden');
  });
});





