const request = require("supertest");
let server;
let agent;

const db = require("../db");
const fs = require("fs");

//Reading files to run before and after all tests. This allows for test database to be set up correctly
const beforeSQL = fs.readFileSync("server/test/db-beforeAll.sql").toString();
const afterSQL = fs.readFileSync("server/test/db-afterAll.sql").toString();

beforeAll(async () => {
  await db.query(beforeSQL);
});

beforeEach(() => {
  server = require("../../server");
  agent = request.agent(server);
  jest.setTimeout(30000);
});

/*
  TESTING REGISTER ENDPOINT
*/
describe("Register", () => {
  test("if successful registration return 201", async () => {
    await request(server)
      .post("/users/register")
      .send({
        name: "test",
        email: "test@test.com",
        password: "pass",
        difficulty: 0,
      })
      .expect(201);
  });
});
/*
  TESTING LOGIN ENDPOINTS
*/
describe("Login", () => {
  test("Should return status 200 if correct email and password given", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);
  });

  test("Should return status 401 if incorrect password given", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "wrongpassword" })
      .expect(401);
  });

  test("Should return status 401 if incorrect email given", async () => {
    await agent
      .post("/users/login")
      .send({ email: "wrongemail@test.com", password: "pass" })
      .expect(401);
  });

  test("Should return status 200 if user is logged in", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.get("/api/loggedin").expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          loggedin: true,
        },
      })
    );
  });

  test("Should return status 200 if user is not logged in", async () => {
    let res = await request(server).get("/api/loggedin").expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          loggedin: false,
        },
      })
    );
  });
});

/*
  TESTING GET ENDPOINTS
*/
describe("GET /api/flashcards", () => {
  test("GET /api/flashcards should return a 200 status code.", async () => {
    await request(server).get("/api/flashcards").expect(200);
  });

  test("return a list of all flashcards.", async () => {
    let res = await request(server).get("/api/flashcards");
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          flashcards: expect.any(Object),
        },
      })
    );
  });
  test("return data in JSON format.", async () => {
    await request(server).get("/api/flashcards").expect("Content-Type", /json/);
  });
});

describe("GET /api/learnflashcards", () => {
  test("if logged in then GET /api/learnflashcards should return a 200 status code.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    await agent.get("/api/learnflashcards").expect(200);
  });

  test("if not logged in in then GET /api/learnflashcards should return a 401 status code.", async () => {
    await request(server).get("/api/learnflashcards").expect(401);
  });

  //### This test could be better.
  test("return a list of flashcards that the user is learning.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent
      .get("/api/learnflashcards")
      .expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          flashcards: expect.any(Object),
        },
      })
    );
  });
});

//GET /api/reviewflashcard
describe("GET /api/reviewflashcard", () => {
  test("if logged in then GET /api/reviewflashcards should return a 200 status code.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    await agent.get("/api/reviewflashcards").expect(200);
  });

  test("if not logged in in then GET /api/reviewflashcards should return a 401 status code.", async () => {
    await request(server).get("/api/reviewflashcards").expect(401);
  });

  //### This test could be better.
  test("return a list of flashcards in the users 'review deck'.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent
      .get("/api/reviewflashcards")
      .expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          flashcards: expect.any(Object),
        },
      })
    );
  });
});

describe("GET /api/user", () => {
  test("if logged in then should return a 200 status code.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    await agent.get("/api/user").expect(200);
  });

  test("if not logged in in then should return a 401 status code.", async () => {
    await request(server).get("/api/user").expect(401);
  });

  test("return user information.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.get("/api/user").expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          difficulty: 0,
          email: "test@test.com",
          exp: 0,
          name: "test",
        },
      })
    );
  });
});

describe("GET /api/loggedin", () => {
  test("if logged in then should return a 200 status code.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    await agent.get("/api/loggedin").expect(200);
  });

  test("if not logged in in then should return a 200 status code.", async () => {
    await request(server).get("/api/loggedin").expect(200);
  });

  test("return datastructure with loggedin = true if logged in.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.get("/api/loggedin").expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          loggedin: true,
        },
      })
    );
  });
  test("return datastructure with loggedin = false if not logged in.", async () => {
    let res = await request(server)
      .get("/api/loggedin")
      .expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          loggedin: false,
        },
      })
    );
  });
});

describe("GET /api/quiz", () => {
  test("should return a 200 status code.", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    await agent.get("/api/quiz").expect(200);
  });

  test("return datastructure with quiz question and options", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.get("/api/quiz").expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          question: expect.any(Object),
          options: expect.any(Object),
        },
      })
    );
  });
});

describe("GET /api/leaderboard", () => {
  test("should return a 200 status code.", async () => {
    await request(server).get("/api/leaderboard").expect(200);
  });

  test("return datastructure with leaderboard.", async () => {
    let res = await request(server)
      .get("/api/leaderboard")
      .expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          leaderboard: expect.any(Object),
        },
      })
    );
  });
});

/*
  POST ROUTES
*/
describe("POST /api/review", () => {
  let data = {
    flashcardID: 1,
  };

  it("respond with 201 created", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.post("/api/review").send(data).expect(201);
  });

  it("respond with 401 if already exists", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.post("/api/review").send(data).expect(401);
  });

  it("/api/reviewflashcards should return selected flashcard", async () => {
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent
      .get("/api/reviewflashcards")
      .expect("Content-Type", /json/);
    expect(res.body).toEqual(
      expect.objectContaining({
        data: {
          flashcards: [{ back: "a/silent", front: "א", id: "1" }],
        },
      })
    );
  });
});

describe("PUT /api/correctcard", () => {
  it("returns 201 if database successfully updated", async () => {
    let data = { flashcardID: 1 };
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.put("/api/correctcard").send(data).expect(200);
  });

  it("returns 401 if database unsuccessful", async () => {
    let data = { flashcardID: 100 };

    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.put("/api/correctcard").send(data).expect(401);
  });
});

describe("PUT /api/incorrectcard", () => {
  it("returns 201 if database successfully updated", async () => {
    let data = { flashcardID: 1 };
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.put("/api/incorrectcard").send(data).expect(200);
  });

  it("returns 401 if database unsuccessfully updated", async () => {
    let data = { flashcardID: 100 };
    await agent
      .post("/users/login")
      .send({ email: "test@test.com", password: "pass" })
      .expect(200);

    let res = await agent.put("/api/incorrectcard").send(data).expect(401);
  });
});

afterEach(async () => {
  await server.close(); // Closes the server after each test.
});

afterAll(async () => {
  await db.query(afterSQL);
  await new Promise((resolve) => setTimeout(() => resolve(), 10000)); // avoids jest open handle error
});
