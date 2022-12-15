import React from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import Toast from "../common/Toast";

const ShopcartCard = ({ item, cart, setCart }) => {
  const deleteItem = () => {
    delete cart[item.id];
    Toast(`${item.title} has been remove from Cart!`);
    setCart({ ...cart });
  };
  return (
    <Card>
      <Row>
        <Col xs={12} md={5}>
          <Card.Img variant="left" src={item.imageUrl} />
        </Col>

        <Col xs={7} md={4}>
          <Card.Body>
            <Card.Title>{item.title}</Card.Title>
            <Col>{item.description}</Col>
            <Col>Quantity:</Col>
            <Col className="cartBtn">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  if (cart[item.id].amount <= 1) deleteItem();
                  else setCart({ ...cart }, cart[item.id].amount--);
                }}
              >
                -
              </Button>
              <span>{item.amount}</span>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  setCart({ ...cart }, cart[item.id].amount++);
                }}
              >
                +
              </Button>
            </Col>
          </Card.Body>
        </Col>

        <Col xs={1} md={2}>
          <Button
            className="ShopcartRemove"
            variant="danger"
            onClick={() => deleteItem()}
          >
            Remove
          </Button>
        </Col>
        <Col className="priceItem">
          <b>${item.price}</b>
        </Col>
      </Row>
    </Card>
  );
};

export default ShopcartCard;
