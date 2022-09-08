import React from "react";
import { Button, Card, Col, Row } from "react-bootstrap";

// Show a list of items
const ItemList = ({ items }) => {
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
              <Button variant="primary">View More</Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ItemList;
