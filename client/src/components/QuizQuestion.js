/**
 * @file Renders a single quiz question.
 * @author Harry Rudolph
 */

import React from "react";
import Button from "react-bootstrap/Button";

/**
 * Component renders a single quiz question
 * @param props.question Question passed from parent
 * @param {Function} props.handler Function to be called when button is pressed, passed from parent.
 * @param props.options Options passed from parent
 */
export default class QuizQuestion extends React.Component {
  render() {
    return (
      <div className="text-center mx-4">
        How do you pronounce <br />?{this.props.question}
        <hr />
        <Button
          onClick={() => this.props.handler(0)}
          className="m-1"
          variant="primary"
        >
          {this.props.options[0]}
        </Button>
        <br />
        <Button
          onClick={() => this.props.handler(1)}
          className="m-1"
          variant="primary"
        >
          {this.props.options[1]}
        </Button>
        <br />
        <Button
          onClick={() => this.props.handler(2)}
          className="mf-1"
          variant="primary"
        >
          {this.props.options[2]}
        </Button>
        <br />
        <Button
          onClick={() => this.props.handler(3)}
          className="m-1"
          variant="primary"
        >
          {this.props.options[3]}
        </Button>
      </div>
    );
  }
}
