import React from "react";

const Success = () => {
  setTimeout(function () {
    window.location.replace("/");
  }, 3000);
  return (
    <div className="Common">
      <h1>Purchase Successfully! Thank you for your purchase!</h1>
    </div>
  );
};

export default Success;
