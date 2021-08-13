/**
 * @file Main Application file. React entry point.
 * @author Harry Rudolph
 */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Header from "./components/Header.js";
import Home from "./pages/Home.js";
import Learn from "./pages/Learn.js";
import Review from "./pages/Review.js";
import User from "./pages/User.js";
import EditUser from "./pages/EditUser.js";
import Register from "./pages/Register.js";
import Login from "./pages/Login.js";
import About from "./pages/About.js";
import Quiz from "./components/Quiz.js";

/**
 * Main entry point for React App
 * @returns Router to determine which page to be displayed.
 */
const App = () => {
  return (
    // Ensures refresh on redirect
    <Router forceRefresh={true}>
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/learn" component={Learn} />
        <Route path="/review" component={Review} />
        <Route path="/user" component={User} />
        <Route path="/edituser" component={EditUser} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/quiz" component={Quiz} />
      </Switch>
    </Router>
  );
};

export default App;
