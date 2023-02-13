import React from "react";
import SidecartCard from "./SidecartCard";

function Sidecart({ cart, setCart, currentUser }) {
  // if not login or empty cart, not show side cart
  if (!Object.keys(carts) || Object.keys(cart).length === 0 || !currentUser) {
    return null;
  }

  let total = 0;
  Object.keys(cart).forEach((key) => {
    total += cart[key].price * cart[key].amount;
  });
  return (
    <div className="sidecart">
      <div>Subtotal:</div>
      <b>${Math.round(total * 100) / 100}</b>
      {Object.keys(cart).map((key) => (
        <SidecartCard
          item={cart[key]}
          key={cart[key].title}
          setCart={setCart}
          cart={cart}
        />
      ))}
    </div>
  );
}

export default Sidecart;
