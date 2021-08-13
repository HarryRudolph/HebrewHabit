/**
 * @file Renders list of flashcards that user is currently learning.
 * @author Harry Rudolph
 */
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Message from "./Message.js";

import Flashcard from "./Flashcard.js";

/**
 * Component returns a list of flashcards based on user data.
 * @returns A list of flashcards that the user has 'Added to deck'
 */
const ReviewFlashcardList = () => {
  const [state, setState] = useState({
    loading: true,
    cards: null,
    removedFromList: false,
    messageText: null,
    messageType: null,
  });

  /**
   * React useEffect hook. This is called once when component is first mounted.
   * fetchData is the only function inside. We need to gather data asynchronously,
   * useEffect cannot do that so we use a new function inside.
   */
  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
      const response = await fetch(url + "api/reviewflashcards", {
        withCredentials: true,
        credentials: "include",
      });
      const data = await response.json();
      //Storing flashcards, and loading information in state.
      setState({ cards: data.data.flashcards, loading: false });
    };
    fetchData();
  }, []); //The [] ensures that this use effect is only called on first update.

  /**
   * Function called by child when the 'Message' disspears. This allows LearnFlashcardList
   * to know when to remove the 'Message'
   * @function
   */
  const removeAlertMessageHandler = () => {
    setState({ ...state, removedFromList: false });
  };

  /**
   * Called when the 'Correct' button is pressed by user
   * @function
   * @param id The Flashcard ID as in the database.
   * @param index The Flashcard index in the array as it is being displayed.
   */
  const correct = (id, index) => {
    return () => {
      //Call api passing FlashcardID
      fetch("/api/correctcard", {
        method: "PUT",
        body: JSON.stringify({ flashcardID: id }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        //If successfully marked as correct then update state with new array.
        if (response.status === 200) {
          let array = state.cards;
          array.splice(index, 1);
          setState({
            ...state,
            cards: array,
            removedFromList: true,
            messageText: "Correct! +10exp",
            messageType: "success",
          });
        } else {
          console.log("error");
        }
      });
      //Call api to give user exp.
      fetch("/api/exp", {
        method: "PUT",
        body: JSON.stringify({ exp: 10 }),
        headers: { "Content-Type": "application/json" },
      });
    };
  };

  /**
   * Called when the 'Incorrect' button is pressed by user
   * @function
   * @param id The Flashcard ID as in the database.
   * @param index The Flashcard index in the array as it is being displayed.
   */
  const incorrect = (id, index) => {
    return () => {
      //Call api passing FlashcardID
      fetch("/api/incorrectcard", {
        method: "PUT",
        body: JSON.stringify({ flashcardID: id }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        //If successfully marked as correct then update state with new array.
        if (response.status === 200) {
          let array = state.cards;
          array.splice(index, 1);
          setState({
            ...state,
            cards: array,
            removedFromList: true,
            messageText: "Incorrect",
            messageType: "danger",
          });
        } else {
          console.log("error");
        }
      });
    };
  };

  if (state.loading) {
    return <div> loading... </div>;
  }

  if (state.cards.length === 0) {
    return (
      <div>
        {" "}
        {state.removedFromList && (
          <Message
            text={state.messageText}
            type={state.messageType}
            handler={removeAlertMessageHandler}
          />
        )}
        <hr />
        <h3 className="mt-3 text-center">
          No cards to review, please check back later.{" "}
        </h3>
      </div>
    );
  }

  if (state.cards) {
    let arr = state.cards;
    let elements = []; //Array that stores all Flashcard components.
    for (let i = 0; i < arr.length; i++) {
      // Push the flashcard component to elements array
      elements.push(
        <div key={arr[i].id}>
          <Container fluid>
            <Row>
              <Flashcard
                key={arr[i].id}
                front={arr[i].front}
                back={arr[i].back}
              />
            </Row>
            <Row>
              <Col className="text-center">
                <Button variant="danger" onClick={incorrect(arr[i].id, i)}>
                  Again
                </Button>
              </Col>
              <Col className="text-center">
                <Button variant="success" onClick={correct(arr[i].id, i)}>
                  Correct
                </Button>
              </Col>
            </Row>
          </Container>
          <hr />
        </div>
      );
    }
    //In most usecases this will be returned. The Message
    //will only be visible when a flashcard has been removed from list.
    return (
      <div className="mx-auto">
        {state.removedFromList && (
          <Message
            text={state.messageText}
            type={state.messageType}
            handler={removeAlertMessageHandler}
          />
        )}
        <hr />
        {elements}
      </div>
    );
  }
};

export default ReviewFlashcardList;
