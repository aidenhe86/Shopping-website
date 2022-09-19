import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./Alert.css";

function CommonAlert({ message }) {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <div className="Alert">
        <Alert
          key="danger"
          variant="danger"
          onClose={() => setShow(false)}
          dismissible
        >
          {message}
        </Alert>
      </div>
    );
  }

  return null;
}

export default CommonAlert;
