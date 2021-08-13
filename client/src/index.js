/**
 * @file Entry point for browser
 * @author Harry Rudolph
 */

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

//Render react app. Insert it into 'Root div' in '../public/index.html'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
