const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Journal = require("../models/Journal");

let mongoServer;

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
  await Journal.deleteMany();
});

describe("Journal API (No Auth)", () => {

  it("Should create a new journal entry", async () => {
    const res = await request(app)
      .post("/api/journal")
      .send({
        entry_text: "Today I felt calm and productive."
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("entry_text", "Today I felt calm and productive.");
  });

  it("Should fail when journal text is missing", async () => {
    const res = await request(app)
      .post("/api/journal")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Journal entry text is required");
  });

});
