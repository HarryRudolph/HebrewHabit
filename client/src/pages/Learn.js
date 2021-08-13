/**
 * @file Renders Learn page
 * @author Harry Rudolph
 */
import React from "react";
import LearnFlashcardList from "../components/LearnFlashcardList.js";

/**
 * Component renders Learn page.
 * @returns Information with LearnFlashCardList component
 */
const Learn = () => {
  return (
    <div>
      <div className="m-1">
        <h2>Learn</h2>
        Below you will see some flashcards, the front of the flashcard has a
        Hebrew symbol. The back of the flashcard has the English phonetic
        pronunciation. Here you can choose which flashcards to add to your deck,
        the order that the flashcards appear below is recommended. We suggest
        choosing a few to focus on per day.
      </div>
      <LearnFlashcardList />
    </div>
  );
};

export default Learn;
