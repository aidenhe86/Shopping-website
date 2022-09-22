import React, { useState, useContext } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import "./itemButton.css";
import Alert from "../common/Alert";
import UserContext from "../auth/UserContext";
// import ShoppingApi from "../api";

const ItemButton = ({ itemId, price }) => {
  const [amount, setAmount] = useState(1);
  const { cart, setCart } = useContext(UserContext);
  // const [formErrors, setFormErrors] = useState([]);
  // async function handleOrder() {
  //   try {
  //     await ShoppingApi.purchase(itemId, { amount });
  //   } catch (err) {
  //     setFormErrors(err);
  //   }
  // }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Order</Popover.Header>
      <Popover.Body className="buttonBody">
        <div className="itemButton">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setAmount(amount + 1)}
          >
            +
          </Button>
          <span>{amount}</span>
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
        </div>
        <hr></hr>
        <div>price:{(price * amount).toFixed(2)}</div>
        <Button
          onClick={() => {
            cart[itemId] = amount;
            setCart({ ...cart });
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
      {/* {formErrors.length ? formErrors.map((e) => <Alert message={e} />) : null} */}
    </>
  );
};

export default ItemButton;
