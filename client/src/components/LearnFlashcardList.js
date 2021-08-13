/**
 * @file Renders list of flashcards that user currently does not have in their deck.
 * @author Harry Rudolph
 */
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Flashcard from "./Flashcard.js";
import Message from "./Message.js";

/**
 * Component returns a list of flashcards based on user data.
 * @returns A list of flashcards that the user has not 'Added to deck'
 */
const LearnFlashcardList = () => {
  const [state, setState] = useState({
    loading: true,
    cards: null,
    removedFromList: false,
  });

  /**
   * React useEffect hook. This is called once when component is first mounted.
   * fetchData is the only function inside. We need to gather data asynchronously,
   * useEffect cannot do that so we use a new function inside.
   */
  useEffect(() => {
    const fetchData = async () => {
      const url = process.env.REACT_APP_BASEURL || "http://localhost:3001/";
      const response = await fetch(url + "api/learnflashcards", {
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
   * Called when the 'Add to Deck' button is pressed by user
   * @function
   * @param id The Flashcard ID as in the database.
   * @param index The Flashcard index in the array as it is being displayed.
   */
  const addToDeck = (id, index) => {
    //Call api passing FlashcardID
    return () => {
      fetch("/api/review", {
        method: "POST",
        body: JSON.stringify({ flashcardID: id }),
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        //If successfully 'Added to Deck' then update state with new array.
        if (response.status === 201) {
          let array = state.cards;
          array.splice(index, 1);
          setState({ ...state, cards: array, removedFromList: true });
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
        <h3 className="mt-3 text-center">
          You have added all the cards to your review deck.
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
            <Row className="text-center">
              <Col>
                <Button variant="info" onClick={addToDeck(arr[i].id, i)}>
                  Add to Review List
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
            text="Added to Deck"
            type="success"
            handler={removeAlertMessageHandler}
          />
        )}
        <hr />
        {/* List of flashcards */}
        {elements}
      </div>
    );
  }
};

export default LearnFlashcardList;
