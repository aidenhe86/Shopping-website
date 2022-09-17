import React from "react";

// Show this component if the page is still loading

function Loading() {
  return (
    <div className="d-flex Common">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;
