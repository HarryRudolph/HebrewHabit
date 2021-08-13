/**
 * @file Manages all custom routes that app uses.
 * @author Harry Rudolph
 */

const express = require("express");
const router = express.Router();

const db = require("../db");
const bcrypt = require("bcrypt");

const passport = require("passport");
require("../passport-config");

/*
    GET Routes
*/

/**
 * Route to retrieve all flashcards.
 * @name get/api/flashcards
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 */
router.get("/api/flashcards", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM flashcards");
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        flashcards: results.rows,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to retrieve all flashcards that a user has not added to their deck.
 * @name get/api/learnflashcards
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.get("/api/learnflashcards", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT * FROM flashcards WHERE NOT EXISTS (SELECT * from user_flashcard \
        WHERE user_id=$1 AND id=user_flashcard.flashcard_id)",
      [req.user.id],
      (err, res) => {
        if (err) {
          console.log(err);
          //handle err
        }
      }
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        flashcards: results.rows,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route retrieves all flashcards that a user has added to their deck, and are due to be reviewed.
 * @name get/api/reviewflashcards
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.get("/api/reviewflashcards", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT * FROM flashcards WHERE EXISTS (SELECT * from user_flashcard \
        WHERE user_id=$1 AND id=user_flashcard.flashcard_id AND reviewdatetime <= NOW());",
      [req.user.id],
      (err, res) => {
        if (err) {
          console.log(err);
          //handle err
        }
      }
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        flashcards: results.rows,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to retrieve all data for current user.
 * @name get/api/user
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.get("/api/user", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT name, email, exp, difficulty FROM users WHERE id=$1;",
      [req.user.id],
      (err, res) => {
        if (err) {
          //handle err
        }
      }
    );
    const first = results.rows[0];
    res.status(200).json({
      status: "success",
      data: {
        name: first.name,
        email: first.email,
        exp: first.exp,
        difficulty: first.difficulty,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to check if user is logged in.
 * @name get/api/loggedin
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user {Object} The user object, if exists.
 */
router.get("/api/loggedin", async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({
        data: {
          loggedin: true,
        },
      });
    } else {
      res.status(200).json({
        data: {
          loggedin: false,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "You are not authorized to view this resource",
    });
  }
});

/**
 * Route to retrieve quiz questions
 * @name get/api/quiz
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user.difficulty {Object} The difficulty property of the user.
 */
router.get("/api/quiz", async (req, res) => {
  console.log("api/quiz");
  try {
    const question = await db.query(
      "SELECT * FROM quiz WHERE difficulty=$1 ORDER BY RANDOM() LIMIT 1;",
      [req.user.difficulty]
    );
    const options = await db.query(
      "SELECT * FROM quiz WHERE id!=$1 AND difficulty=$2 ORDER BY RANDOM() LIMIT 3",
      [question.rows[0].id, req.user.difficulty]
    );

    console.log("question");
    console.log(question);
    console.log("options");
    console.log(options);
    res.status(200).json({
      status: "success",
      data: {
        question: question.rows,
        options: options.rows,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to retrieve leaderboard
 * @name get/api/leaderboard
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 */
router.get("/api/leaderboard", async (req, res) => {
  try {
    const results = await db.query(
      "SELECT name, exp FROM users ORDER BY exp DESC LIMIT 10"
    );
    res.status(200).json({
      status: "success",
      results: results.rows.length,
      data: {
        leaderboard: results.rows,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/*
      POST ROUTES
*/

/**
 * Route to add a flashcard to review deck
 * @name post/api/review
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.user.id {Object} The user's ID (found in session).
 * @param req.body.flashcardID {Object} The ID of the flashcard to be moved into review deck.
 */
router.post("/api/review", async (req, res) => {
  try {
    let { flashcardID } = req.body;

    const results = await db.query(
      "INSERT INTO user_flashcard(user_id, flashcard_id) VALUES($1, $2);",
      [req.user.id, flashcardID],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );
    if (results.rowCount) {
      // This is kind of a hack, if inserted into database,
      // send correct status back
      return res.status(201).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to log user in to application
 * @name post/users/login
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 */
router.post("/users/login", (req, res) => {
  try {
    passport.authenticate("local", (err, user, info) => {
      if (user === false) {
        //error
        return res.status(401).json({
          success: false,
        });
      } else {
        //Success
        req.logIn(user, (err) => {
          if (err) {
            return res.status(401).json({
              success: false,
            });
          }
          return res.status(200).json({
            success: true,
          });
        });
      }
    })(req, res);
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to register user for the application
 * @name post/users/register
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.body.name {Object} The user's entered name
 * @param req.body.email {Object} The user's entered email
 * @param req.body.password {Object} The user's entered password
 * @param req.body.difficulty {Object} The user's entered difficulty.
 */
router.post("/users/register", async (req, res) => {
  try {
    let { name, email, password, difficulty } = req.body;
    const hash = await bcrypt.hash(password, 10);
    //@Unfinished: Is this a safe way to send queries to the db?
    const results = await db.query(
      "INSERT INTO users(name, email, hash, difficulty) VALUES($1, $2, $3, $4);",
      [name, email, hash, difficulty],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );

    if (results.rowCount) {
      //if insterted then respond with 201

      return res.status(201).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/*
  PUT Routes
*/

/**
 * Route to give the current user exp.
 * @name put/api/exp
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.body.exp {Object} The exp to give to current user.
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.put("/api/exp", async (req, res) => {
  try {
    let { exp } = req.body;

    const previousExp = await db.query("SELECT exp from users WHERE id=$1;", [
      req.user.id,
    ]);

    const newExp = previousExp.rows[0].exp + exp;

    const updateData = await db.query(
      "UPDATE users SET exp=$1 WHERE id=$2",
      [newExp, req.user.id],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );
    if (updateData.rowCount) {
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(401).json({
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to mark a flashcard as being recalled correctly.
 * @name put/api/correctcard
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.body.flashcardID The flashcard's ID
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.put("/api/correctcard", async (req, res) => {
  try {
    let { flashcardID } = req.body;

    const previousValues = await db.query(
      "SELECT user_id, flashcard_id, correctRecall, prevInterval, extract(epoch from reviewDateTime) \
      FROM user_flashcard WHERE user_id=$1 AND flashcard_id=$2",
      [req.user.id, flashcardID],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );

    let first = previousValues.rows[0];

    let newCorrectRecall = first.correctrecall + 1;

    //looking at previousValues, get the previous interval, create a new next due
    let newInterval = Math.round(first.previnterval * 2.5);

    let newReviewDate = newInterval + Date.now() / 1000;

    const updateValue = await db.query(
      "UPDATE user_flashcard SET correctRecall=$1, previnterval=$2, reviewDateTime=to_timestamp($3) \
      WHERE user_id=$4 AND flashcard_id=$5;",
      [newCorrectRecall, newInterval, newReviewDate, req.user.id, flashcardID],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );

    if (updateValue.rowCount) {
      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to mark a flashcard as being recalled incorrectly.
 * @name put/api/incorrectcard
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.body.flashcardID The flashcard's ID
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.put("/api/incorrectcard", async (req, res) => {
  try {
    let { flashcardID } = req.body;

    const previousValues = await db.query(
      "SELECT user_id, flashcard_id, correctRecall, prevInterval, extract(epoch from reviewDateTime) \
      FROM user_flashcard WHERE user_id=$1 AND flashcard_id=$2",
      [req.user.id, flashcardID],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );

    let first = previousValues.rows[0];

    let newCorrectRecall = 0;

    //looking at previousValues, get the previous interval, create a new next due
    let newInterval = 60; //1 minute

    let newReviewDate = newInterval + Date.now() / 1000;

    const updateValue = await db.query(
      "UPDATE user_flashcard SET correctRecall=$1, previnterval=$2, reviewDateTime=to_timestamp($3) \
      WHERE user_id=$4 AND flashcard_id=$5;",
      [newCorrectRecall, newInterval, newReviewDate, req.user.id, flashcardID],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );
    if (updateValue.rowCount) {
      // This is kind of a hack, if inserted into database,
      //send correct status back

      return res.status(200).json({
        success: true,
      });
    } else {
      return res.status(401).json({ success: false });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

/**
 * Route to update user information
 * @name put/api/user
 * @function
 * @param {express.Request} req The request
 * @param {express.Response} res The response
 * @param req.body.name The updated user name.
 * @param req.body.email The updated user email.
 * @param req.body.difficulty The updated user difficulty.
 * @param req.user.id {Object} The user's ID (found in session).
 */
router.put("/api/user", async (req, res) => {
  try {
    let { name, email, difficulty } = req.body;

    const results = await db.query(
      "UPDATE users SET name=$1, email=$2, difficulty=$3 WHERE id=$4;",
      [name, email, difficulty, req.user.id],
      (err, res) => {
        if (err) {
          return res.status(401).json({
            success: false,
          });
        }
      }
    );

    if (results.rowCount) {
      //if insterted then respond with 201

      return res.status(200).json({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
    });
  }
});

module.exports = router;
