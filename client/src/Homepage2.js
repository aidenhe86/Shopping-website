import React from "react";
import { Link } from "react-router-dom";
import { Container, Table } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <div className="banner">
        <div className="homeText">
          <h1>Hello there! This is a DEMO of Shopping website!</h1>
          <div>
            You can view items in <Link to="/shop">Shop</Link> and add items
            into <Link to="/shopcart">Cart</Link> and purchase by enter the
            stripe test card number listed below.
          </div>
          <div>
            Please use below test card info to play around.
            <Table striped bordered>
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
