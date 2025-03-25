import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Navbar bg="white" variant="white" expand="lg" className="shadow">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          {/* Aquí va tu imagen */}
          <img
            src='/images/logo.png'
            alt="Logo"
            style={{ width: '60px', height: '40px', marginRight: '10px' }} 
          />
          SolidarianID
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">Login</Nav.Link>
            <Nav.Link as={Link} to="/register">Registro</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
