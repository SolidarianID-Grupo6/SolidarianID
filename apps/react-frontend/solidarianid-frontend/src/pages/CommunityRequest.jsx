import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

// Enum de ODS
const ODS_ENUM = [
  'Fin de la pobreza',
  'Hambre cero',
  'Salud y bienestar',
  'Educación de calidad',
  'Igualdad de género',
  'Agua limpia y saneamiento',
  'Energía asequible y no contaminante',
  'Trabajo decente y crecimiento económico',
  'Industria, innovación e infraestructura',
  'Reducción de las desigualdades',
  'Ciudades y comunidades sostenibles',
  'Producción y consumo responsables',
  'Acción por el clima',
  'Vida submarina',
  'Vida en la tierra',
  'Paz, justicia e instituciones sólidas',
  'Alianzas para lograr los objetivos',
];

function CommunityRequest() {
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [causeTitle, setCauseTitle] = useState('');
  const [causeDescription, setCauseDescription] = useState('');
  const [causeEndDate, setCauseEndDate] = useState('');
  const [selectedOds, setSelectedOds] = useState([]);

  const handleCommunitySubmit = (e) => {
    e.preventDefault();

    const newCause = {
      title: causeTitle,
      description: causeDescription,
      creationDate: new Date(),
      endDate: causeEndDate,
      ods: selectedOds, // Aquí se pasan los ODS seleccionados
    };

    const newCommunity = {
      name: communityName,
      description: communityDescription,
      creator: 'usuario_actual', // Aquí el creador se asignaría automáticamente
      admins: ['admin_id_1', 'admin_id_2'], // Los administradores se asignarían automáticamente
      causes: [newCause],
      creationDate: new Date(),
    };

    // Mostrar los datos en la consola
    console.log('Comunidad creada:', newCommunity);
  };

  const handleOdsChange = (selectedOptions) => {
    setSelectedOds(selectedOptions);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: '0.375rem', // Agrega el mismo borde redondeado que Bootstrap
      borderColor: '#ced4da', // El color del borde de Bootstrap
      boxShadow: 'none', // Elimina el borde azul de enfoque por defecto
      padding: '0.375rem 0.75rem', // El mismo padding de Bootstrap
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e9ecef', // El fondo gris para los elementos seleccionados
      borderRadius: '0.375rem',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#495057', // Color de texto similar al de Bootstrap
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#495057', // Color del icono de eliminar
      ':hover': {
        backgroundColor: '#dee2e6', // El color de fondo en hover
      },
    }),
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: "url('/images/4.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          opacity: 0.7,
        }}
      ></div>
      <Container className="my-5">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Crear nueva comunidad</h1>
        </div>
        <Card className="shadow-lg mx-auto w-100" style={{ maxWidth: '50rem' }}>
          <Card.Body>
            <Form onSubmit={handleCommunitySubmit}>
              <Row>
                {/* Columna de Comunidad */}
                <Col md={6}>
                  <h3 className="text-center">Comunidad</h3>
                  {/* Nombre de la Comunidad */}
                  <Form.Group className="mb-3" controlId="inputName">
                    <Form.Label>Nombre de la Comunidad</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      value={communityName}
                      onChange={(e) => setCommunityName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Descripción de la Comunidad */}
                  <Form.Group className="mb-3" controlId="inputDescription">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Descripción"
                      value={communityDescription}
                      onChange={(e) => setCommunityDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Columna de Causa */}
                <Col md={6}>
                  <h3 className="text-center">Causa</h3>
                  {/* Título de la Causa */}
                  <Form.Group className="mb-3" controlId="inputCauseTitle">
                    <Form.Label>Título de la causa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Título"
                      value={causeTitle}
                      onChange={(e) => setCauseTitle(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Descripción de la Causa */}
                  <Form.Group
                    className="mb-3"
                    controlId="inputCauseDescription"
                  >
                    <Form.Label>Descripción de la causa</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Descripción"
                      value={causeDescription}
                      onChange={(e) => setCauseDescription(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* Fecha de Fin de la Causa */}
                  <Form.Group className="mb-3" controlId="inputCauseEndDate">
                    <Form.Label>Fecha de Finalización</Form.Label>
                    <Form.Control
                      type="date"
                      value={causeEndDate}
                      onChange={(e) => setCauseEndDate(e.target.value)}
                      required
                    />
                  </Form.Group>

                  {/* ODS (Objetivos de Desarrollo Sostenible) */}
                  <Form.Group className="mb-3" controlId="inputOds">
                    <Form.Label>Objetivos de sesarrollo sostenible de la causa</Form.Label>
                    <Select
                      isMulti
                      options={ODS_ENUM.map((ods) => ({
                        value: ods,
                        label: ods,
                      }))}
                      value={selectedOds}
                      onChange={handleOdsChange}
                      styles={customStyles}
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="Seleccionar objetivos"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Botón para Enviar */}
              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary">
                  Crear Comunidad
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default CommunityRequest;
