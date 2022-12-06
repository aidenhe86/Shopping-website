import React, { useContext } from "react";
import UserContext from "../auth/UserContext";

const Success = () => {
  const { setCart } = useContext(UserContext);

  setTimeout(function () {
    setCart({});
    window.location.replace("/shop");
  }, 3000);

  return (
    <div className="Common">
      <h1>Purchase Successfully! Thank you for your purchase!</h1>
    </div>
  );
};

export default Success;
