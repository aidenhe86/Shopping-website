import React from "react";

function Cancel() {
  setTimeout(function () {
    window.location.replace("/shop");
  }, 3000);
  return (
    <div className="Common">
      <h1>Order has been canceled!</h1>
    </div>
  );
}

export default Cancel;
