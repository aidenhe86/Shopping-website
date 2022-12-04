import React, { useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import "./itemButton.css";

const ItemButton = ({ item, price, handleCart }) => {
  const [amount, setAmount] = useState(1);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Order</Popover.Header>
      <Popover.Body className="buttonBody">
        <div className="itemButton">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => {
              if (amount <= 1) setAmount(1);
              else setAmount(amount - 1);
            }}
          >
            -
          </Button>
          <span>{amount}</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setAmount(amount + 1)}
          >
            +
          </Button>
        </div>
        <hr></hr>
        <div>price:{(price * amount).toFixed(2)}</div>
        <Button
          onClick={(e) => {
            e.preventDefault();
            handleCart(item, amount);
          }}
        >
          Order
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
        <Button variant="success">Shop Now</Button>
      </OverlayTrigger>
    </>
  );
};

export default ItemButton;
