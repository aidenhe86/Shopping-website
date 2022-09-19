import React, { useState, useContext } from "react";
import { Card, Col, Row } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import ItemButton from "./ItemButton";

// Show a list of items
const ItemList = ({ items }) => {
  const { purchase } = useContext(UserContext);
  const [amount, setAmount] = useState(1);

  return (
    <Row className="ItemList" xs={"auto"}>
      {items.map((i) => (
        <Col key={i.title}>
          <Card style={{ width: "14rem" }}>
            <Card.Img variant="top" src={i.imageUrl} />
            <Card.Body>
              <Card.Title>{i.title}</Card.Title>
              <Col>Quantity: {i.quantity}</Col>
              <Col>Price: ${i.price}</Col>
              <Col>{i.description}</Col>
              <ItemButton
                itemId={i.id}
                price={i.price}
                amount={amount}
                setAmount={setAmount}
                purchase={purchase}
              />
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ItemList;
