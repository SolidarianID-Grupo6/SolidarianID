import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { FaUserAlt, FaPlusCircle, FaCheckCircle } from 'react-icons/fa';
import styles from './Home.module.css';

function Home() {
  return (
    <>
      <div className={styles.background} aria-hidden="true"></div>
      <Container
        className="d-flex flex-column align-items-center mt-5 text-white"
        style={{
          backgroundImage: "url('/images/your-background-image.jpg')", // Cambia la URL a tu imagen de fondo
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Título */}
        <h1
          className="fw-bold mb-4"
          style={{
            fontSize: '5rem',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          }}
        >
          Bienvenido a SolidarianID
        </h1>

        {/* Descripción breve */}
        <p
          className="mb-5"
          style={{
            fontSize: '2rem',
            textAlign: 'center',
            maxWidth: '800px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)',
          }}
        >
          Conéctate con comunidades y causas que marcan la diferencia. ¡Únete y
          comienza a hacer el bien hoy!
        </p>

        {/* Botones */}
        <Row className="w-75">
          <Col md={6} className="mb-4">
            <Link to="/register">
              <Button variant="warning" className="w-100 py-3" size="lg">
                <FaUserAlt className="me-2" />
                Registro
              </Button>
            </Link>
          </Col>

          <Col md={6} className="mb-4">
            <Link to="/login">
              <Button variant="danger" className="w-100 py-3" size="lg">
                <FaUserAlt className="me-2" />
                Iniciar sesión
              </Button>
            </Link>
          </Col>

          <Col md={6} className="mb-4">
            <Link to="/communityRequest">
              <Button variant="info" className="w-100 py-3" size="lg">
                <FaPlusCircle className="me-2" />
                Crear Comunidad
              </Button>
            </Link>
          </Col>

          <Col md={6} className="mb-4">
            <Link to="/validateCommunities">
              <Button variant="success" className="w-100 py-3" size="lg">
                <FaCheckCircle className="me-2" />
                Validar Comunidades
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Home;
