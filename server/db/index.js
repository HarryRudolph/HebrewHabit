/**
 * @file Manages database setup and config
 * @author Harry Rudolph
 */

const { Pool } = require("pg");
require("dotenv").config();

/**
 * Database variables for local development
 * @constant
 */
const devConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
};

/**
 * Database variables for local testing
 * @constant
 */
const testConfig = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: "test",
  port: process.env.PGPORT,
};

/**
 * Database variables for production
 * Heroku makes this easy by only having to pass in one variable (DATABASE_URL)
 * @constant
 */
const proConfig = {
  connectionString: process.env.DATABASE_URL,
};

//Control flow to select environment
let chosenConfig = devConfig;
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  chosenConfig = proConfig;
}
if (process.env.NODE_ENV === "test") {
  chosenConfig = testConfig;
}

const pool = new Pool(chosenConfig);

module.exports = {
  query: (text, params) => pool.query(text, params),
};
