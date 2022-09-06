import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
//import UserContext from "../auth/UserContext";

function Home() {
  //   const { currentUser } = useContext(UserContext);
  const { currentUser } = "anao";
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h3>Welcome to Shopping-Website!</h3>
        </Card.Title>
        <Card.Subtitle>This is a Sample project.</Card.Subtitle>
        {currentUser ? (
          <h4>Welcome Back, {currentUser.firstName || currentUser.username}</h4>
        ) : (
          <span>
            <Link className="btn btn-primary" to="/login">
              Login
            </Link>{" "}
            <Link className="btn btn-primary" to="/signup">
              Sign Up
            </Link>{" "}
          </span>
        )}
      </Card.Body>
    </Card>
  );
}

export default Home;
