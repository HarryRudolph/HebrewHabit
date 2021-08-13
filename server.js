/**
 * @file Entry point for application. Holds boilerplate code for server
 * @author Harry Rudolph
 */
const express = require("express");

require("dotenv").config(); //Loads environment variables from .env
const session = require("express-session");

const app = express();

const cors = require("cors");
app.use(cors({ credentials: true, origin: true }));

//Instructs the back end to serve the front end statically. This is important for deployment,
//Heroku only uses one dyno to host the application.
app.use(express.static(__dirname + "/client/build"));

app.use(express.json()); //All requests use JSON formatting.

//ForceSSL package ensures all requests are with TLS
const forceSsl = require("force-ssl-heroku");
app.use(forceSsl);

//Different settings for if running in production/staging environment.
if (process.env.NODE_ENV == "staging" || process.env.NODE_ENV == "production") {
  app.set("trust proxy", 1); //Needed for heroku to manage ssl cookie properly
}
if (process.env.NODE_ENV == "production") {
  //Forces domain name without www. This allows for cookies to work correctly.
  app.all("*", require("express-force-domain")("https://hebrewhabit.com"));
}

/**
 * Used to connect to the Postgres database to store session data.
 * @constant
 **/
const sessionStore = require("connect-pg-simple")(session);

//Session
app.use(
  session({
    store: new sessionStore(),
    secret: "temp",
    resave: false,
    saveUninitialized: false, //Stops all new requests making session.
    cookie: {
      secure: process.env.NODE_ENV === "production", //If in produciton use secure cookies
      httpOnly: !(process.env.NODE_ENV === "production"), //If in production do not use http.
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    },
  })
);

//Passport imports
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());
require("./server/passport-config");

//Import routes
const routes = require("./server/routes/route");
app.use(routes);

// If Express doesn't recognise route serve index.html.
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

//Set port to environment variable or 3001
const port = process.env.PORT || 3001;
app.set("port", port);
const server = app.listen(port, () => {
  console.log(`listening on ${port}`);
});

module.exports = server;
