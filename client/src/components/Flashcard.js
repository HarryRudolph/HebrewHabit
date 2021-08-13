/**
 * @file Renders, and flips a single flashcard.
 * @author Harry Rudolph
 */

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "./styles.css";

/**
 * Component returns a single flashcard
 * @param props.front Information for the front of the flashcard.
 * @param props.back Information for the back of the flashcard.
 * @returns A single Flashcard held in a div.
 */
const Flashcard = (props) => {
  const [flip, setFlip] = useState(false);
  return (
    <div className="text-center container mx-auto" style={{ width: "40rem" }}>
      {/* Classname on card changes based on state, allowing for CSS flip animation. */}
      <Card
        className={`mx-auto my-4 card ${flip ? "flip" : ""}`}
        onClick={() => setFlip(!flip)}
        p
      >
        <div className="text-center front">{props.front}</div>
        <div className="back" id="back">
          {props.back}
        </div>
      </Card>
      <Button className="mb-3" variant="primary" onClick={() => setFlip(!flip)}>
        Show Answer
      </Button>
    </div>
  );
};

export default Flashcard;
