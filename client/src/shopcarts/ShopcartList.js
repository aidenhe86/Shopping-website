import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import ShopcartCard from "./ShopcartCard";
import usePurchase from "../hooks/usePurchase";
import "./Shopcart.css";

const ShopcartList = () => {
  const { cart, setCart } = useContext(UserContext);
  const purchase = usePurchase();
  let total = 0;
  let amount = 0;

  if (Object.keys(cart).length === 0) {
    return (
      <div className="Common">
        <h1>Shoplist is Empty!</h1>
      </div>
    );
  }

  Object.keys(cart).forEach((key) => {
    total += cart[key].price * cart[key].amount;
    amount += cart[key].amount;
  });

  return (
    <Container className="d-grid gap-4 shopcart">
      <h1>Your Item:</h1>
      <b className="priceTitle">Price</b>
      <hr></hr>
      {Object.keys(cart).map((key) => (
        <ShopcartCard
          item={cart[key]}
          key={cart[key].title}
          setCart={setCart}
          cart={cart}
        />
      ))}
      <hr></hr>
      <div style={{ textAlign: "right", fontSize: "25px" }}>
        Subtotal ({amount} {amount === 1 ? "item" : "items"}):$
        {Math.round(total * 100) / 100}
      </div>
      <Button
        onClick={() => {
          purchase(cart);
        }}
      >
        Purchase
      </Button>
    </Container>
  );
};

export default ShopcartList;
