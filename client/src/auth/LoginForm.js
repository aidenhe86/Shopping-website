import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import Toast from "../common/Toast";
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
      navigate("/shop");
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
        <h2 className="text-center">Log In</h2>
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

        <div className="d-grid gap-2">
          <Button variant="primary" size="lg" type="submit">
            Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default LoginForm;
