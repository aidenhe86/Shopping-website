import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import ShopcartCard from "./ShopcartCard";
import usePurchase from "../hooks/usePurchase";

const ShopcartList = () => {
  const { cart, setCart } = useContext(UserContext);
  const purchase = usePurchase();

  if (Object.keys(cart).length === 0) {
    return (
      <div className="Common">
        <h1>Shoplist is Empty!</h1>
      </div>
    );
  }

  return (
    <Container className="d-grid gap-5 shopcart">
      {Object.keys(cart).map((key) => (
        <ShopcartCard
          item={cart[key]}
          key={cart[key].title}
          setCart={setCart}
          cart={cart}
        />
      ))}
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
