/**
 * @file Renders the navigation bar.
 * @author Harry Rudolph
 */

import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

/**
 * Component returns different Navigtion Bar depending on conditions.
 * @returns Navbar based on conditions
 */
const Header = () => {
  const [state, setState] = useState({
    loggedin: false,
  });

  /**
   * React useEffect hook. This is called once when component is first mounted.
   *  fetchData is the only function inside. We need to gather data asynchronously,
   * useEffect cannot do that so we use a new function inside.
   */
  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
      const response = await fetch(url + "api/loggedin", {
        withCredentials: true,
        credentials: "include",
      });
      const data = await response.json();

      //Store whether the user is logged in or not in the state.
      //This is then used to determine which navbar to return
      setState({ loggedin: data.data.loggedin });
    };
    fetchData();
  }, []); //The [] ensures that this use effect is only called on first update.

  //Control flow to display different Navigation bar depending on if you are logged in.
  if (!state.loggedin) {
    return (
      <Navbar
        collapseOnSelect
        expand="sm"
        className="container-fluid"
        bg="dark"
        variant="dark"
      >
        <Navbar.Brand className="px-3" href="/">
          Hebrew Habit
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="about">About</Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link href="login">Login/Register</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  } else {
    return (
      <Navbar
        collapseOnSelect
        expand="sm"
        className="container-fluid"
        bg="dark"
        variant="dark"
      >
        <Navbar.Brand className="px-3" href="/">
          Hebrew Habit
        </Navbar.Brand>

        <Navbar.Toggle />

        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Nav.Link href="learn">Learn</Nav.Link>
            <Nav.Link href="review">Review</Nav.Link>
            <Nav.Link href="quiz">Quiz</Nav.Link>
            <Nav.Link href="user">User</Nav.Link>
            <Nav.Link href="about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

export default Header;
