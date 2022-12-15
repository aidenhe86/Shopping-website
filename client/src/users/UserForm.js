import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Form, Row } from "react-bootstrap";
import UserContext from "../auth/UserContext";
import useLogin from "../hooks/useLogin";
import useUpdateUser from "../hooks/useUpdateUser";
import Loading from "../Loading";
import Toast from "../common/Toast";
import state from "../common/state";

const UserForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState([]);
  const loginAPI = useLogin();
  const navigate = useNavigate();
  const updateUser = useUpdateUser();
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        address: currentUser.address,
        city: currentUser.city,
        state: currentUser.state,
        zip: currentUser.zip,
        password: "",
        newPassword: "",
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
      await loginAPI({
        username: currentUser.username,
        password: formData.password,
      });
      if (formData.newPassword) {
        formData.password = formData.newPassword;
      }
      delete formData.newPassword;
      formData.zip = +formData.zip || formData.zip;
      updatedUser = await updateUser(currentUser.username, formData);
    } catch (e) {
      setFormErrors(e);
      return;
    }
    setCurrentUser(updatedUser);
    Toast("Successfully Update Profile!", "success");
    navigate("/shop");
  };
  const handleToast = (formErrors) => {
    formErrors.map((e) => Toast(e, "error"));
    setFormErrors([]);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <div className="container">
        <h1>{currentUser.username}'s Profile</h1>
        {formErrors.length ? handleToast(formErrors) : null}
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
        <Form.Group className="mb-3" controlId="formGridAddress">
          <Form.Label>Address</Form.Label>
          <Form.Control
            onChange={handleChange}
            name="address"
            value={formData.address}
            placeholder="Address"
            required
          />
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
              <option key="">Choose...</option>
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

        <Form.Group className="mb-3" controlId="formGridNewPassword">
          <Form.Label>Set New Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleChange}
            name="newPassword"
            placeholder="New Password"
            autoComplete="false"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGridPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleChange}
            name="password"
            placeholder="Current Password"
            autoComplete="false"
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
