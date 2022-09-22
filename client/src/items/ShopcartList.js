import React, { useState, useContext } from "react";
// import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import UserContext from "../auth/UserContext";

const ShopcartList = () => {
  const { cart, setCart } = useContext(UserContext);
  return (
    <div className="container d-grid gap-5">
      {Object.keys(cart).map((key) => (
        <div>
          Key: {key}, Value: {cart[key]}
        </div>
      ))}
    </div>
  );
};

export default ShopcartList;
