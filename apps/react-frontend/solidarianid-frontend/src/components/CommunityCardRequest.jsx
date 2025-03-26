import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CommunityInfo from './CommunityInfo';
import CommunityRejectRequest from './CommunityRejectRequest';

function CommunityCardRequest({ community }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [modalType, setModalType] = useState(null);

  const openModal = (type) => {
    setSelectedCommunity(community);
    setModalType(type);
  };

  const closeModal = () => {
    setSelectedCommunity(null);
    setModalType(null);
  };

  return (
    <Card className=" bg-light mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        {/* Checkbox y Nombre */}
        <div className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            id={`community-${community.id}`}
            className="me-2"
          />
          <Card.Text className="mb-0">
            <strong>{community.name}</strong>: {community.description}
          </Card.Text>
        </div>

        <div className="d-flex">
          {/* Botón de Información */}
          <Button
            variant="info"
            onClick={() => openModal('info')} 
            className="rounded-circle d-flex align-items-center justify-content-center p-0"
            style={{ width: '40px', height: '40px' }}
          >
            <img
              src="/images/info-icon.png"
              alt="Info"
              className="img-fluid"
              style={{ width: '24px', height: '24px' }}
            />
          </Button>

          {/* Botó de Rechazar */}
          <Button variant="danger" className="ms-3" onClick={() => openModal('reject')}>
            Rechazar
          </Button>
        </div>
      </Card.Body>

      {/* Modal de Información */}
      {selectedCommunity && modalType === 'info' && (
        <CommunityInfo
          community={selectedCommunity}
          onClose={closeModal}
        />
      )}

      {/* Modal de Rechazo */}
      {selectedCommunity && modalType === 'reject' && (
        <CommunityRejectRequest
          community={selectedCommunity}
          onClose={closeModal}
        />
      )}

    </Card>
  );
}

export default CommunityCardRequest;
