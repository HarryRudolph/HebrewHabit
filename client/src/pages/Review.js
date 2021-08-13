/**
 * @file Renders Review page
 * @author Harry Rudolph
 */
import React from "react";
import ReviewFlashcardList from "../components/ReviewFlashcardList.js";

/**
 * Component renders Review page.
 * @returns Information and ReviewFlashcardList
 */
const Review = () => {
  return (
    <div>
      <div className="m-1">
        <h2>Review</h2>
        After adding cards to your deck, you can then review them. Try to recall
        the back of each flashcard, then mark it as correct or incorrect.
        <h5 className="mt-1 mb-0">Correct Cards</h5>
        Cards recalled correctly will appear back in your review list at a later
        time, to ensure that you do not forget them.
        <h5 className="mt-1 mb-0">Incorrect Cards</h5>
        Cards marked as incorrect will appear back in your list in 60 seconds.
      </div>
      <ReviewFlashcardList />
    </div>
  );
};

export default Review;
