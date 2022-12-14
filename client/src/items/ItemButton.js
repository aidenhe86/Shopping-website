import React, { useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import Toast from "../common/Toast";
import "./itemButton.css";

const ItemButton = ({ item, price, handleCart }) => {
  const [amount, setAmount] = useState(1);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Order</Popover.Header>
      <Popover.Body>
        <div className="itemsBtn">
          <Button
            variant="outline-primary"
            className="btnBox"
            onClick={() => {
              if (amount <= 1) setAmount(1);
              else setAmount(amount - 1);
            }}
          >
            -
          </Button>
          <b>{amount}</b>
          <Button
            variant="outline-primary"
            className="btnBox"
            onClick={() => setAmount(amount + 1)}
          >
            +
          </Button>
        </div>
        <hr></hr>
        <b>Price: ${(price * amount).toFixed(2)}</b>
        <Button
          size="sm"
          onClick={() => {
            document.body.click();
            Toast(`Add ${amount} ${item.title}!`);
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
      <OverlayTrigger
        trigger="click"
        rootClose
        placement="bottom"
        overlay={popover}
      >
        <Button>Add to cart</Button>
      </OverlayTrigger>
    </>
  );
};

export default ItemButton;
