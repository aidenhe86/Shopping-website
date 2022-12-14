import React from "react";
import { Button } from "react-bootstrap";
import Toast from "../common/Toast";

function SidecartCard({ item, cart, setCart }) {
  const deleteItem = () => {
    delete cart[item.id];
    Toast(`${item.title} has been remove from Cart!`);
    setCart({ ...cart });
  };
  return (
    <div className="sidecartCard">
      <img src={item.imageUrl} alt={item.title}></img>
      <b>${item.price}</b>
      <div className="itemsBtn">
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            if (cart[item.id].amount <= 1) deleteItem();
            else setCart({ ...cart }, cart[item.id].amount--);
          }}
        >
          -
        </Button>
        <span>{item.amount}</span>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => {
            setCart({ ...cart }, cart[item.id].amount++);
          }}
        >
          +
        </Button>
      </div>
      <Button variant="secondary" size="sm" onClick={() => deleteItem()}>
        Remove
      </Button>
    </div>
  );
}

export default SidecartCard;
