import { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { communitiesRequest } from '../services/api';
import CommunityCardRequest from '../components/CommunityCardRequest';

function ValidateCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await communitiesRequest();
        if (data) setCommunities(data);
      } catch (error) {
        console.error('Error al obtener comunidades:', error);
      } finally {
        setLoading(false); // Desactiva el spinner cuando la API responde
      }
    };

    fetchData();
  }, []);

  const validateSelectedCommunities = () => {
    alert('Solicitudes validadas.');
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
          <h1 className="fw-bold">Validar comunidades</h1>
        </div>

        <Card className="shadow-lg mx-auto" style={{ maxWidth: '40rem' }}>
          <Card.Body>
            {/* Spinner de carga mientras esperamos datos */}
            {loading && (
              <div className="d-flex justify-content-center my-4">
                <Spinner animation="border" variant="primary" />
              </div>
            )}

            {/* Lista de comunidades */}
            <div id="comunidades-request-list">
              {communities.length > 0
                ? communities.map((community) => (
                    <CommunityCardRequest
                      key={community.id}
                      community={community}
                    />
                  ))
                : !loading && (
                    <Alert variant="warning" className="text-center">
                      No hay solicitudes de comunidad.
                    </Alert>
                  )}
            </div>

            {/* Botón de validación */}
            <div className="d-flex justify-content-end mt-4">
              <Button variant="success" onClick={validateSelectedCommunities}>
                Validar Solicitudes Seleccionadas
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default ValidateCommunities;
