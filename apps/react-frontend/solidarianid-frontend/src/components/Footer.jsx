import React from "react";
import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      <Container>
        <p className="mb-0">&copy; {new Date().getFullYear()} Mi Sitio Web. Todos los derechos reservados.</p>
      </Container>
    </footer>
  );
}

export default Footer;
