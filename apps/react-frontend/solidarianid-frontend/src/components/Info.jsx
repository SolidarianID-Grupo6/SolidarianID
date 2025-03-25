import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';

function Info() {
  useEffect(() => {
    // Inicializar los tooltips de Bootstrap después de que el componente se haya montado
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new window.bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  return (
    <Button 
      variant="info" 
      data-bs-toggle="tooltip" 
      data-bs-placement="top" 
      title="Aquí va la información adicional"
    >
      Información
    </Button>
  );
}

export default Info;
