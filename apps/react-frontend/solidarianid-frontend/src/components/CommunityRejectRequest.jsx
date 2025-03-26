import React from "react";
import { Modal, Button, Form} from "react-bootstrap";

function CommunityRejectRequest( {community, onClose} ) {
  return (
    <Modal show={!!community} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Rechazar solicitud de comunidad</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="rejectReason">
            <Form.Label>Motivo de rechazo para la comunidad: {community.name}</Form.Label>
            <Form.Control as="textarea" rows={3} />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="danger" onClick={onClose}>
          Rechazar
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CommunityRejectRequest;
