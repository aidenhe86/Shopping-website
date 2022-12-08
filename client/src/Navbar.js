import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import UserContext from "./auth/UserContext";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);

  const login = () => {
    return (
      <Nav>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/shop">
          Shop
        </Nav.Link>
        <Nav.Link as={Link} to="/profile">
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/shopcart">
          Shop Cart
        </Nav.Link>
        <Nav.Link as={Link} to="/" onClick={logout}>
          Sign Out
        </Nav.Link>
      </Nav>
    );
  };
  const signout = () => {
    return (
      <Nav>
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/login">
          Login
        </Nav.Link>
        <Nav.Link as={Link} to="/signup">
          Sign Up
        </Nav.Link>
      </Nav>
    );
  };

  return (
    <div>
      <Navbar expand="lg" bg="dark" variant="dark">
        <Container fluid style={{ margin: "0 60px" }}>
          <Navbar.Brand as={Link} to="/">
            Shopping
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-nav" />
          <Navbar.Collapse id="navbar-nav" className="justify-content-end">
            {currentUser ? login() : signout()}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
