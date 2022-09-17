import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import UserContext from "./auth/UserContext";

function NavBar({ logout }) {
  const { currentUser } = useContext(UserContext);
  const login = () => {
    return (
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/profile">
          Profile
        </Nav.Link>
        <Nav.Link as={Link} to="/" onClick={logout}>
          Sign Out
        </Nav.Link>
      </Nav>
    );
  };
  const signout = () => {
    return (
      <Nav className="me-auto">
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
      <Navbar expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Shopping
          </Navbar.Brand>
        </Container>
        {currentUser ? login() : signout()}
      </Navbar>
    </div>
  );
}

export default NavBar;
