import React, { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
// import UserContext from "../auth/UserContext";

function NavBar({ logout }) {
  //   const { currentUser } = useContext(UserContext);
  const currentUser = "";
  const login = () => {
    return (
      <Nav className="me-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/shoplist">Shop List</Nav.Link>
        <Nav.Link href="/user">User</Nav.Link>
        <Nav.Link href="/signout">Sign Out</Nav.Link>
      </Nav>
    );
  };
  const signout = () => {
    return (
      <Nav className="me-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/login">Login</Nav.Link>
        <Nav.Link href="/signup">Sign Up</Nav.Link>
      </Nav>
    );
  };

  return (
    <div>
      <Navbar expand="md" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Shopping</Navbar.Brand>
        </Container>
        {currentUser ? login() : signout()}
      </Navbar>
    </div>
  );
}

export default NavBar;
