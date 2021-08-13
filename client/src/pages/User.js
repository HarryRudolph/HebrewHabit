/**
 * @file Renders User page
 * @author Harry Rudolph
 */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Leaderboard from "../components/Leaderboard";
import Level from "../components/Level";

/**
 * Component renders User page
 * @returns User information, Level and Leaderboard component.
 */
const User = () => {
  const [state, setState] = useState({
    name: null,
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
      //Storing user data in state.
      setState({
        name: data.data.name,
        difficulty: data.data.difficulty,
      });
    };
    fetchData(); //UseEffect cannot be asynchronous so have to use function inside.
  }, []); //The [] ensures that this use effect is only called on first update.

  return (
    <div className="text-center">
      <Button href="/edituser" variant="link">
        EditUser
      </Button>
      <h3>Display Name: {state.name} </h3>
      <br />
      <h4>Quiz Difficulty: {state.difficulty ? "Word Test" : "Letter Test"}</h4>
      <Level />
      <br />
      <Leaderboard />
    </div>
  );
};

export default User;
