/**
 * @file Renders Home page
 * @author Harry Rudolph
 */

import React from "react";

/**
 * Component renders Home page.
 * @returns Home page.
 */
const Home = () => {
  return (
    <div className="mx-5 text-center">
      <div>
        <h1>Hebrew Habit</h1>
        Hebrew Habit is a tool to help you to phonetically read Modern Hebrew.
      </div>
      <div>
        This tool uses flashcards to help you to learn how to 'sound out' words
        from the symbols that make up the Hebrew alphabet.
      </div>
      <br />
    </div>
  );
};

export default Home;
