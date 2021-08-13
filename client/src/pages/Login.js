/**
 * @file Renders Login page
 * @author Harry Rudolph
 */
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router";

/**
 * Component renders Login page.
 * @returns Form to allow users to login
 */
const Login = () => {
  const [state, setState] = React.useState({
    email: "",
    password: "",
    redirect: false,
    error: false,
  });

  /**
   * Called everytime the form is edited. Constantly updating state with user input.
   * @function
   * @param event Form component that is currently being interacted with.
   */
  const handleChange = (event) => {
    const value = event.target.value;
    setState({ ...state, [event.target.name]: value });
  };

  /**
   * Ran when form is submitted, sends data to backend api. If logged in successfully then redirect = true.
   * @function
   * @param event Form component that is currently being interacted with.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/users/login", {
      method: "POST",
      body: JSON.stringify(state),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    }).then((response) => {
      if (response.status === 200) {
        setState({ redirect: true });
      } else {
        setState({ ...state, redirect: false, error: true }); //have to use ...state to keep state of the form
      }
    });
  };

  //Redirect to Home if logged in successfully.
  if (state.redirect) {
    return <Redirect to="/" />;
  } else {
    return (
      <div>
        <Form className="mx-5" onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={state.password}
              onChange={handleChange}
            />
          </Form.Group>
          <a href="register">Don't have an account? Register</a>
          <br></br>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {state.error ? (
          <Alert key="danger" variant="danger">
            Incorrect email/password
          </Alert>
        ) : null}
      </div>
    );
  }
};

export default Login;
