const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const User = require("../models/User");

let mongoServer;

process.env.JWT_SECRET = "testsecret123";

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany();
});

describe("Users API (Register & Login)", () => {

  // it("Should register a new user", async () => {
  //   const res = await request(app)
  //     .post("/api/users/register")
  //     .send({
  //       name: "Test User",
  //       email: "test@test.com",
  //       password: "123456"
  //     });

  //   expect(res.statusCode).toBe(201);
  //   expect(res.body).toHaveProperty("token");
  //   expect(res.body.message).toBe("User registered successfully!");
  //   expect(res.body.username).toBe("Test User");
  // });//

  it("Should login the user successfully", async () => {
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "test@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.username).toBe("Test User");
  });

  it("Should fail login if user does not exist", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "nouser@test.com",
        password: "123456"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User not found");
  });

  it("Should fail login if password is incorrect", async () => {
    await request(app)
      .post("/api/users/register")
      .send({
        name: "Test User",
        email: "test@test.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: "test@test.com",
        password: "wrongpass"
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid credentials");
  });

});
