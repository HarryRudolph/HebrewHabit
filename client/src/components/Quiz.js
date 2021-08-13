/**
 * @file Renders Quiz that users can take.
 * @author Harry Rudolph
 */
import React from "react";
import QuizQuestion from "./QuizQuestion.js";

/**
 * Component renders Quiz for users to interact with.
 */
export default class Quiz extends React.Component {
  state = {
    loading: false,
    question: null,
    options: null,
    score: 0,
    questionNumber: 0,
    answer: -1,
    questionCorrect: false,
  };

  /**
   * Called when button has been pressed, i.e. when quiz answer has been entered.
   * @function
   * @param buttonPressed ID of button that has been pressed
   */
  handler = (buttonPressed) => {
    this.setState({
      questionNumber: this.state.questionNumber + 1,
    });

    if (this.state.answer === buttonPressed) {
      this.setState({
        score: this.state.score + 1,
        questionCorrect: true,
      });
    } else {
      this.setState({
        questionCorrect: false,
      });
    }
    //After question has been answered, fetch another question.
    this.fetchQuestion();
  };

  /**
   * Fetches a question from database and stores in state.
   * @function
   */
  async fetchQuestion() {
    const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
    const response = await fetch(url + "api/quiz", {
      withCredentials: true,
      credentials: "include",
    });
    const data = await response.json();
    //Store the options in the state.
    this.setState({
      question: data.data.question,
      options: [
        data.data.options[0].eng,
        data.data.options[1].eng,
        data.data.options[2].eng,
      ],
      loading: false,
    });

    //Then randomly instert the answer among the options.
    this.setState({
      options: this.randomlyInsertAnswer(this.state.options),
    });
  }

  /**
   * Called once when component is first mounted. This fetches initial question.
   * @function
   */
  componentDidMount() {
    this.fetchQuestion();
  }

  /**
   * Function will randomly insert the answer into an array of options, storing
   * the position in the state.
   * @function
   * @param options Array of options to insert answer into.
   * @returns Array of options with answer inserted into it.
   */
  randomlyInsertAnswer(options) {
    let correctAns = Math.floor(Math.random() * 4);
    this.setState({ answer: correctAns });
    options.splice(correctAns, 0, this.state.question[0].eng);
    return options;
  }

  render() {
    if (this.state.loading) {
      return <div> loading... </div>;
    }

    //If there is a question and options then render.
    if (this.state.question && this.state.options) {
      return (
        <div className="mx-auto">
          <h5>
            Score: {this.state.score}/{this.state.questionNumber}
            {this.state.questionCorrect && <h6>Correct! </h6>}
          </h5>
          <QuizQuestion
            question={this.state.question[0].heb}
            lang={"english"}
            options={this.state.options}
            handler={this.handler}
          />
        </div>
      );
    } else {
      return <div>something has gone wrong</div>;
    }
  }
}
