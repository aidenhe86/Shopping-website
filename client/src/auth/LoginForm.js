import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";

// login form

const LoginForm = ({ login }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    let result = await login(formData);
    // check if successful login, if not show error message
    if (result.success === true) {
      navigate("/categories");
    } else {
      setFormErrors(result.e);
    }
  };
  return (
    <Form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
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
              autoComplete="on"
              required
            />
          </Col>
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </div>
        {formErrors.length ? formErrors.map((e) => <div>{e}</div>) : null}
      </div>
    </Form>
  );
};

export default LoginForm;
