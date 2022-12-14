import React, { useContext } from "react";
import { Carousel } from "react-bootstrap";
import ItemButton from "./ItemButton";
import UserContext from "../auth/UserContext";

// Show a list of items
const ItemList = ({ items }) => {
  const { cart, setCart } = useContext(UserContext);
  const handleCart = (i, amount) => {
    if (cart[i.id]) {
      cart[i.id]["amount"] += amount;
    } else {
      cart[i.id] = { ...i, amount };
    }
    setCart({ ...cart });
  };

  return (
    <div className="items">
      <Carousel fade>
        {items.map((i) => (
          <Carousel.Item key={i.title}>
            <img className="d-block w-100" src={i.imageUrl} alt={i.title} />
            <Carousel.Caption className="itemsBody">
              <h3>{i.title}</h3>
              <div>Available: {i.quantity}</div>
              <div>Price: ${i.price}</div>
              <div>{i.description}</div>
              <ItemButton item={i} price={i.price} handleCart={handleCart} />
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ItemList;
