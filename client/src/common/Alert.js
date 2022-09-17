import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "./Alert.css";

function CommonAlert({ messages = [] }) {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <div className="Alert">
        {messages.map((e) => (
          <Alert
            key="danger"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            {e}
          </Alert>
        ))}
      </div>
    );
  }
  return null;
}

export default CommonAlert;
