import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CommunityInfo from './CommunityInfo';

function CommunityCardRequest({ community }) {
  const [selectedCommunity, setSelectedCommunity] = useState(null);

  return (
    <Card className=" bg-light mb-3">
      <Card.Body className="d-flex justify-content-between align-items-center">
        {/* 🔹 Checkbox y Nombre */}
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

        {/* 🔹 Botón de Información */}
        <Button
          variant="info"
          onClick={() => setSelectedCommunity(community)}
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
      </Card.Body>

      {/* 🔹 Modal de Información */}
      {selectedCommunity && (
        <CommunityInfo
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
    </Card>
  );
}

export default CommunityCardRequest;
