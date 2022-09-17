import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import ShoppingApi from "../api";
import Loading from "../Loading";

const UserForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: "",
      });
      setIsLoading(false);
    }
  }, [currentUser]);
  if (isLoading) return <Loading />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedUser;
    try {
      updatedUser = await ShoppingApi.updateCurrentUser(
        currentUser.username,
        formData
      );
    } catch (e) {
      setFormErrors(e);
      return;
    }
    setCurrentUser(updatedUser);
    navigate("/");
  };
  return (
    <Form onSubmit={handleSubmit}>
      <div className="container">
        {formErrors.length
          ? formErrors.map((e) => (
              <Alert key="danger" variant="danger">
                {e}
              </Alert>
            ))
          : null}
        <Form.Group className="mb-3" controlId="formGridUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control placeholder={currentUser.username} disabled />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="firstName"
              value={formData.firstName}
              placeholder="first name"
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="lastName"
              value={formData.lastName}
              placeholder="last name"
              required
            />
          </Form.Group>
        </Row>
        <Form.Group className="mb-3" controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            onChange={handleChange}
            name="email"
            value={formData.email}
            placeholder="email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridPassword">
          <Form.Label>Set New Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleChange}
            name="password"
            value={formData.password}
            placeholder="Password"
            autoComplete="on"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default UserForm;
