/**
 * @file Renders leaderboard with top 10 user's score.
 * @author Harry Rudolph
 */

import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

/**
 * Component returns leaderboard
 * @returns Leaderboard with user's scores in a div.
 */
const Leaderboard = () => {
  const [state, setState] = useState({
    leaderboard: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
      const response = await fetch(url + "api/leaderboard", {
        method: "GET",
        withCredentials: true,
        credentials: "include",
      });
      const data = await response.json();
      setState({
        leaderboard: data.data.leaderboard,
      });
    };
    fetchData(); //UseEffect cannot be asynchronous so have to use function inside.
  }, []); // The [] ensures that useEffect is only ran once

  const leaderboard = state.leaderboard;
  if (!state.leaderboard) {
    return <div></div>;
  }
  return (
    <div>
      <h3>Leaderboard</h3>
      <Table className="" bordered>
        <thead>
          <tr>
            <th>Rank</th>
            <th>DisplayName</th>
            <th>EXP</th>
          </tr>
        </thead>

        {leaderboard.map((user, index) => {
          return (
            <tbody key={index}>
              <tr>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.exp}</td>
              </tr>
            </tbody>
          );
        })}
      </Table>
    </div>
  );
};

export default Leaderboard;
