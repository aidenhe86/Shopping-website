import React from "react";
import { Card, Col } from "react-bootstrap";
import ItemButton from "./ItemButton";

const itemCard = ({ i, cart, setCart }) => {
  const handleCart = (i, amount) => {
    cart[i.id] = { ...i, amount };
    setCart({ ...cart });
  };
  return (
    <Col key={i.title}>
      <Card style={{ width: "14rem", borderRadius: "5px" }}>
        <Card.Img variant="top" src={i.imageUrl} />
        <Card.Body>
          <Card.Title>{i.title}</Card.Title>
          <Col>Available: {i.quantity}</Col>
          <Col>Price: ${i.price}</Col>
          <Col>{i.description}</Col>
          <ItemButton item={i} price={i.price} handleCart={handleCart} />
        </Card.Body>
      </Card>
    </Col>
  );
};

export default itemCard;
