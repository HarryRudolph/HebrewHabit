/**
 * @file Renders Register page
 * @author Harry Rudolph
 */
import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router";

/**
 * Component returns Register page.
 * @returns Form and data used to edit user information.
 */
const Register = () => {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: "",
    difficulty: 0,
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
   * Ran when form is submitted, converts form data to JSON, then sends a POST
   * request to the back end server with the JSON data in body.
   * @function
   * @param event Form component that is currently being interacted with.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("/users/register", {
      method: "POST",
      body: JSON.stringify(state),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 201) {
        setState({ redirect: true });
      } else {
        setState({ ...state, redirect: false, error: true }); //have to use ...state to keep state of the form
      }
    });
  };

  //Used to redirect to Login if successfully registered.
  if (state.redirect) {
    return <Redirect to="/login" />;
  } else {
    return (
      <div>
        <Form className="mx-5" onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>
              Display Name (Others will see this on the leaderboard)
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Name"
              value={state.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Enter email"
              value={state.email}
              onChange={handleChange}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
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
          <br />

          <Form.Group controlId="formDifficultySelect">
            <Form.Label> Reading Ability</Form.Label>
            <Form.Control
              as="select"
              name="difficulty"
              value={state.difficulty}
              onChange={handleChange}
            >
              <option value="0">Cannot read any letters</option>
              <option value="1">Can read letters</option>
            </Form.Control>
          </Form.Group>
          <h5>
            This is a student project, you use real information at your own
            risk.
          </h5>
          <a href="Login">Already have an account? Login</a>
          <br></br>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        {state.error ? (
          <Alert key="danger" variant="danger">
            Error in registration
          </Alert>
        ) : null}
      </div>
    );
  }
};

export default Register;
