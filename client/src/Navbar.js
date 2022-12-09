import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faShoppingCart,
  faShop,
  faHouse,
  faRightFromBracket,
  faRightToBracket,
  faRegistered,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "./auth/UserContext";

function NavBar({ logout }) {
  const { currentUser, cart } = useContext(UserContext);

  const login = () => {
    return (
      <Nav>
        <Nav.Link as={Link} to="/">
          <FontAwesomeIcon icon={faHouse} />
        </Nav.Link>
        <Nav.Link as={Link} to="/shop">
          <FontAwesomeIcon icon={faShop} />
        </Nav.Link>
        <Nav.Link as={Link} to="/shopcart">
          <span>{Object.keys(cart).length}</span>
          <FontAwesomeIcon icon={faShoppingCart} />
        </Nav.Link>

        <Nav.Link as={Link} to="/profile">
          <FontAwesomeIcon icon={faUser} />
        </Nav.Link>
        <Nav.Link as={Link} to="/" onClick={logout}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </Nav.Link>
      </Nav>
    );
  };
  const signout = () => {
    return (
      <Nav>
        <Nav.Link as={Link} to="/">
          <FontAwesomeIcon icon={faHouse} />
        </Nav.Link>
        <Nav.Link as={Link} to="/login">
          <FontAwesomeIcon icon={faRightToBracket} />
        </Nav.Link>
        <Nav.Link as={Link} to="/signup">
          <FontAwesomeIcon icon={faRegistered} />
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
