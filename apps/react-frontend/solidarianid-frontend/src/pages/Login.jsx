import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '../storage/userSlice';
import { Container, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FaUser, FaLock } from 'react-icons/fa';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de autenticación con datos estáticos
    const userData = {
      nombre: 'NombreEjemplo',
      apellido: 'ApellidoEjemplo',
      email: email,
      fotoUrl: 'https://example.com/foto.jpg',
    };
    dispatch(login(userData));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <div className={styles.background} aria-hidden="true"></div>
      <Container
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '80vh' }}
      >
        <div className="text-center mb-4">
          <h1 className="fw-bold">Login</h1>
        </div>

        <Card className="shadow-lg mx-auto w-100" style={{ maxWidth: '30rem' }}>
          <Card.Body>
            <Form onSubmit={handleLogin}>
              {/* Email */}
              <Form.Group className="mb-3" controlId="inputEmail">
                <Form.Label>Correo Electrónico</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaUser /></InputGroup.Text> {/* Icono de usuario */}
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>

              {/* Contraseña */}
              <Form.Group className="mb-3" controlId="inputPassword">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                  <InputGroup.Text><FaLock /></InputGroup.Text> {/* Icono de llave */}
                  <Form.Control
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </InputGroup>
              </Form.Group>

              {/* Botón de Login */}
              <div className="d-flex justify-content-end mt-4">
                <Button type="submit" variant="primary">
                  Login
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default Login;
