import React, { useContext } from "react";
import { Row } from "react-bootstrap";
import ItemCard from "./ItemCard";
import UserContext from "../auth/UserContext";

// Show a list of items
const ItemList = ({ items }) => {
  const { cart, setCart } = useContext(UserContext);

  return (
    <Row className="ItemList" xs={"auto"}>
      {items.map((i) => (
        <ItemCard i={i} cart={cart} setCart={setCart} key={i.id} />
      ))}
    </Row>
  );
};

export default ItemList;
