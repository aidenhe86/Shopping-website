import React, { useState, useContext } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import UserContext from "../auth/UserContext";

const ItemButton = ({ itemId, price }) => {
  const { purchase } = useContext(UserContext);
  const [amount, setAmount] = useState(1);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Purchase</Popover.Header>
      <Popover.Body>
        <div>
          Amount: {amount}
          <br></br>
          <Button
            variant="outline-primary"
            size="sm"
            xs={1}
            onClick={() => setAmount(amount + 1)}
          >
            +
          </Button>
          <Button
            variant="outline-primary"
            size="sm"
            xs={1}
            onClick={() => {
              if (amount <= 1) setAmount(1);
              else setAmount(amount - 1);
            }}
          >
            -
          </Button>
        </div>
        <hr></hr>
        <div>price:{(price * amount).toFixed(2)}</div>
        <br></br>
        <div>
          <Button onClick={async () => await purchase(itemId, { amount })}>
            Purchase
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
      <Button variant="success">Shop Now</Button>
    </OverlayTrigger>
  );
};

export default ItemButton;
