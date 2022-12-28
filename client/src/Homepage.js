import React from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";

function Home() {
  return (
    <Container>
      <div className="banner">
        <div className="homeText">
          <h1>Hello there! This is a DEMO of eShops!</h1>
          <div>
            To explore this website, please click{" "}
            <Link to="/login" state={{ user: "testuser", pwd: "password" }}>
              here
            </Link>{" "}
            to login with a test user account or create a new account{" "}
            <Link to="/signup">here</Link>! Already registered? Click{" "}
            <Link to="/login">here</Link> to login!
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Home;
