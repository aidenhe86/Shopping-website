import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import Toast from "../common/Toast";
import state from "../common/state";
// signup form

const SignupForm = ({ signup }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });
  const [formErrors, setFormErrors] = useState([]);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((formData) => ({
      ...formData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    formData.zip = +formData.zip || formData.zip;
    let result = await signup(formData);
    // check if successful login, if not show error message
    if (result.success === true) {
      navigate("/");
    } else {
      setFormErrors(result.e);
    }
  };
  const handleToast = (formErrors) => {
    formErrors.map((e) => Toast(e, "error"));
    setFormErrors([]);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        {formErrors.length ? handleToast(formErrors) : null}
        <h2 className="text-center">Sign Up</h2>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalUsername"
        >
          <Col>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              onChange={handleChange}
              name="username"
              value={formData.username}
              placeholder="Username"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Col>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              onChange={handleChange}
              name="password"
              value={formData.password}
              placeholder="Password"
              autoComplete="false"
              required
            />
          </Col>
        </Form.Group>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="firstName"
              value={formData.firstName}
              placeholder="First Name"
              required
            />
          </Form.Group>
          <Form.Group as={Col} controlId="formGridLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="lastName"
              value={formData.lastName}
              placeholder="Last Name"
              required
            />
          </Form.Group>
        </Row>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalAddress">
          <Col>
            <Form.Label>Address</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="address"
              value={formData.address}
              placeholder="Address"
              required
            />
          </Col>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="city"
              value={formData.city}
              placeholder="City"
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridState">
            <Form.Label>State</Form.Label>
            <Form.Select
              onChange={handleChange}
              name="state"
              placeholder="state"
              defaultValue={formData.state}
            >
              <option>Choose...</option>
              {state.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridZip">
            <Form.Label>Zip</Form.Label>
            <Form.Control
              onChange={handleChange}
              name="zip"
              value={formData.zip}
              placeholder="zip"
              required
            />
          </Form.Group>
        </Row>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              onChange={handleChange}
              name="email"
              value={formData.email}
              placeholder="Email"
              required
            />
          </Col>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default SignupForm;
