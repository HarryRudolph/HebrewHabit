/**
 * @file Manages passport.js authentication setup and config
 * @author Harry Rudolph
 */

const passport = require("passport");
const db = require("./db");
const bcrypt = require("bcrypt");

//Use the passport-local strategy
const LocalStrategy = require("passport-local").Strategy;

/**
 * Custom Field
 * @constant
 */
const customFields = {
  usernameField: "email",
};

/**
 * Function to verify correct password matches user
 * @function
 * @param {Object} email User entered email
 * @param {Object} password  User entered password
 * @param {Function} done Called after method is finished.
 */
const verifyCallback = async (email, password, done) => {
  try {
    const results = await db.query(
      "SELECT * FROM users WHERE email=$1;",
      [email],
      (err, res) => {
        if (err) {
          return done(err);
        }
      }
    );

    const first = results.rows[0];

    // bcrypt.compare hashes the password (param 1) with a salt then compares them
    bcrypt.compare(password, first.hash, function (err, res) {
      if (err) {
        return done(err);
      }
      if (res) {
        //Correct password entered
        return done(null, { id: first.id });
      } else {
        //Incorrect password entered
        return done(null, false);
      }
    });
  } catch (error) {
    console.log(error);
    return done(error);
  }
};

//Use local strategy with custom fields
const strategy = new LocalStrategy(customFields, verifyCallback);
passport.use(strategy);

/**
 * Required passport function to serialize and store user data in session
 * @function
 */
passport.serializeUser((user, done) => {
  return done(null, user.id);
});

/**
 * Required passport function to deserialize and retrieve user data from session
 * @function
 */
passport.deserializeUser(async (id, done) => {
  const results = await db.query(
    "SELECT * FROM users WHERE id=$1;",
    [id],
    (err, res) => {
      if (err) {
        return done(err);
      }
    }
  );
  const first = results.rows[0];
  if (first != undefined) {
    return done(null, {
      id: id,
      email: first.email,
      name: first.name,
      difficulty: first.difficulty,
    });
  } else {
    //user not found
    return done(null, null);
  }
});
