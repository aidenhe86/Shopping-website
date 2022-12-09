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
            To explore this website, please use the account below to{" "}
            <Link to="/login" state={{ user: "testuser", pwd: "password" }}>
              Login
            </Link>{" "}
            or create a new account <Link to="/signup">Here</Link>!
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Password</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>testuser</td>
                  <td>password</td>
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
