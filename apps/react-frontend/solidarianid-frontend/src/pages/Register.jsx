import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col } from 'react-bootstrap';
import styles from './Register.module.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    surnames: '',
    email: '',
    isEmailPublic: false,
    password: '',
    birthdate: '',
    isBirthdatePublic: false,
    presentation: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <>
      <div className={styles.background} aria-hidden="true"></div>
      <Container className="my-5 ${styles.content}">
        <div className="text-center mb-4">
          <h1 className="fw-bold">Registro</h1>
        </div>

        <Card className="shadow-lg mx-auto" style={{ maxWidth: '40rem' }}>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Columna Izquierda */}
                <Col md={6}>
                  {/* Nombre */}
                  <Form.Group className="mb-3" controlId="inputName">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  {/* Apellidos */}
                  <Form.Group className="mb-3" controlId="inputSurnames">
                    <Form.Label>Apellidos</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Apellidos"
                      value={formData.surnames}
                      onChange={(e) =>
                        setFormData({ ...formData, surnames: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  {/* Fecha de Nacimiento */}
                  <Form.Group className="mb-3" controlId="inputBirthdate">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                      type="date"
                      placeholder="Fecha de Nacimiento"
                      value={formData.birthdate}
                      onChange={(e) =>
                        setFormData({ ...formData, birthdate: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Columna Derecha */}
                <Col md={6}>
                  {/* Email */}
                  <Form.Group className="mb-3" controlId="inputEmail">
                    <Form.Label>Correo Electrónico</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  {/* Contraseña */}
                  <Form.Group className="mb-3" controlId="inputPassword">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Contraseña"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </Form.Group>

                  {/* Checkboxes */}
                  <Form.Group className="mb-3" controlId="checkEmailPublic">
                    <Form.Check
                      type="checkbox"
                      label="Hacer email público"
                      checked={formData.isEmailPublic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isEmailPublic: e.target.checked,
                        })
                      }
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Al marcar esta opción, tu correo será visible para otros usuarios."
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="checkBirthdatePublic">
                    <Form.Check
                      type="checkbox"
                      label="Fecha de nacimiento pública"
                      checked={formData.isBirthdatePublic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isBirthdatePublic: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Presentación */}
              <Form.Group className="mb-3" controlId="textPresentation">
                <Form.Label>Presentación</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Presentación"
                  value={formData.presentation}
                  onChange={(e) =>
                    setFormData({ ...formData, presentation: e.target.value })
                  }
                />
              </Form.Group>

              {/* Botón de Registro */}
              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary">
                  Registrarse
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Register;
