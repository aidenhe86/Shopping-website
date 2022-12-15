import React from "react";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <div className="banner">
        <div className="homeText">
          <h1>Hello there! This is a DEMO of eShops!</h1>
          <div>
            View items in the <Link to="/shop">shop</Link>, add items into the{" "}
            <Link to="/shopcart">cart</Link>, then purchase by entering the
            stripe test card number listed below.
          </div>
          <div>
            Use the test card information below to play around.
            <Table striped bordered className="cardTable">
              <thead>
                <tr>
                  <th>Stripe test card number</th>
                  <th>CVC</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>4242424242424242</td>
                  <td>Any 3 digits</td>
                  <td>Any future date</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;
