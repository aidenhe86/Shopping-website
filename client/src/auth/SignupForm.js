import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import Alert from "../common/Alert";
// signup form

const SignupForm = ({ signup }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
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
    console.log(formData);
    let result = await signup(formData);
    // check if successful login, if not show error message
    if (result.success === true) {
      navigate("/");
    } else {
      setFormErrors(result.e);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        {formErrors.length
          ? formErrors.map((e) => <Alert message={e} />)
          : null}
        <h2 className="text-center">Sign Up</h2>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalUsername"
        >
          <Col>
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
            <Form.Control
              type="password"
              onChange={handleChange}
              name="password"
              value={formData.password}
              placeholder="Password"
              required
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalFirstName"
        >
          <Col>
            <Form.Control
              onChange={handleChange}
              name="firstName"
              value={formData.firstname}
              placeholder="First Name"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalLastName"
        >
          <Col>
            <Form.Control
              onChange={handleChange}
              name="lastName"
              value={formData.lastname}
              placeholder="Last Name"
              required
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
          <Col>
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
        <Form.Group as={Row} className="mb-3" controlId="formHorizontalAddress">
          <Col>
            <Form.Control
              type="text"
              onChange={handleChange}
              name="address"
              value={formData.address}
              placeholder="Address"
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
