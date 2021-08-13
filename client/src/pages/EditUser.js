/**
 * @file Renders EditUser page
 * @author Harry Rudolph
 */
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { Redirect } from "react-router";

/**
 * Component returns EditUser page.
 * @returns Form and data used to edit user information.
 */
const EditUser = () => {
  const [state, setState] = useState({
    name: "",
    email: "",
    difficulty: null,
  });

  /**
   * React useEffect hook. This is called once when component is first mounted.
   * fetchData is the only function inside. We need to gather data asynchronously,
   * useEffect cannot do that so we use a new function inside.
   */
  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
      const response = await fetch(url + "api/user", {
        withCredentials: true,
        credentials: "include",
      });
      const data = await response.json();
      //Storing userdata in state.
      setState({
        name: data.data.name,
        email: data.data.email,
        difficulty: data.data.difficulty,
      });
    };
    fetchData(); //UseEffect cannot be asynchronous so have to use function inside.
  }, []); //The [] ensures that this use effect is only called on first update.

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
    fetch("/api/user", {
      method: "PUT",
      body: JSON.stringify(state),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.status === 200) {
        setState({ redirect: true });
      } else {
        setState({ ...state, redirect: false, error: true }); //have to use ...state to keep state of the form
      }
    });
  };

  //Used to redirect to /user when form is completed.
  if (state.redirect) {
    return <Redirect to="/user" />;
  }
  return (
    <div className="text-center">
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
        </Form.Group>
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
          This is a student project, you use real information at your own risk.
        </h5>
        <br></br>
        <Button variant="primary" type="submit">
          Update
        </Button>
      </Form>
      {state.error ? (
        <Alert key="danger" variant="danger">
          Error in registration
        </Alert>
      ) : null}
    </div>
  );
};

export default EditUser;
