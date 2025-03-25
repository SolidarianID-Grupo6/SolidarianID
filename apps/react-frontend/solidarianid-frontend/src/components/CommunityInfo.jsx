import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";

function CommunityInfo({ community, onClose }) {
  return (
    <Modal show={!!community} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Información Comunidad</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {community ? (
          <Row className="gy-2">
            <Col xs={6} className="fw-bold text-secondary">ID:</Col>
            <Col xs={6} className="text-dark">{community.id}</Col>

            <Col xs={6} className="fw-bold text-secondary">Nombre:</Col>
            <Col xs={6} className="text-dark">{community.name}</Col>

            <Col xs={6} className="fw-bold text-secondary">Descripción:</Col>
            <Col xs={6} className="text-dark">
              {community.description ? community.description : "Sin descripción"}
            </Col>

            <Col xs={6} className="fw-bold text-secondary">Fecha de Solicitud:</Col>
            <Col xs={6} className="text-dark">
              {community.requestDateFormatted || "Desconocida"}
            </Col>

            <Col xs={6} className="fw-bold text-secondary">Estado:</Col>
            <Col xs={6} className="text-dark">{community.status}</Col>

            <Col xs={6} className="fw-bold text-secondary">Causas:</Col>
            <Col xs={6} className="text-dark">
              {community.causes?.length > 0
                ? community.causes.map((cause, index) => (
                    <span key={index}>
                      {cause.title}
                      {index < community.causes.length - 1 ? ", " : ""}
                    </span>
                  ))
                : "Sin causas"}
            </Col>

            <Col xs={6} className="fw-bold text-secondary">Creador:</Col>
            <Col xs={6} className="text-dark">{community.creator}</Col>
          </Row>
        ) : (
          <p>No hay información disponible.</p>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Salir
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommunityInfo;
