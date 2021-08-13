/**
 * @file Renders user's level information
 * @author Harry Rudolph
 */
import React, { useState, useEffect } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

/**
 * Component returns information on user's level
 * @returns Data and a progressbar of user's level.
 */
const Level = () => {
  const [state, setState] = useState({
    exp: null,
    lvl: null,
    percentToNextLvl: null,
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
        method: "GET",
        withCredentials: true,
        credentials: "include",
      });
      const data = await response.json();

      //Performing arithmetic to calculate a 'level' based on total EXP
      let unroundLvl = (1 + Math.sqrt(1 + (8 * data.data.exp) / 50)) / 2;
      let lvl = Math.floor(unroundLvl);
      let percent = Math.round((unroundLvl - lvl) * 100);

      //Storing above data in state.
      setState({ exp: data.data.exp, lvl: lvl, percentToNextLvl: percent });
    };
    fetchData(); //UseEffect cannot be asynchronous so have to use function inside.
  }, []); //The [] ensures that this use effect is only called on first update.

  if (!state.exp) {
    return <div></div>;
  }
  return (
    <div>
      <h4>Total Exp: {state.exp}</h4>
      <h4>Current Level: {state.lvl}</h4>
      <ProgressBar
        className="m-3"
        now={state.percentToNextLvl}
        label={`${state.percentToNextLvl}%`}
      />
      <div className="m-3 d-flex justify-content-between">
        <div>Level {state.lvl}</div>
        <div>Level {state.lvl + 1}</div>
      </div>{" "}
    </div>
  );
};

export default Level;
