import React from "react";
import { Spinner } from "react-bootstrap";

// Show this component if the page is still loading

function Loading() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

export default Loading;
