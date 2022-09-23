import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import "./ShopcartCard.css";

const ShopcartCard = ({ item, cart, setCart }) => {
  return (
    <Card>
      <Row>
        <Col xs={4}>
          <Card.Img
            variant="left"
            style={{ width: "14rem", borderRadius: "5px" }}
            src={item.imageUrl}
          />
        </Col>

        <Col xs={5}>
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Col>Purchase Amount:{item.amount}</Col>
            <Col>Price: ${item.price}</Col>
            <Col>{item.description}</Col>
          </Card.Body>
        </Col>

        <Col md={{ span: 1, offset: 1 }}>
          <Button
            className="Shopcart-Button"
            variant="secondary"
            onClick={() => {
              delete cart[item.id];
              setCart({ ...cart });
            }}
          >
            Remove
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default ShopcartCard;
