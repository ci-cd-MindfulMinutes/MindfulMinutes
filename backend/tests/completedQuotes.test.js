const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const CompletedQuote = require("../models/CompletedQuote");

let mongoServer;
let testUserId;
let testCompletedQuoteId;

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
  await CompletedQuote.deleteMany();

  testUserId = new mongoose.Types.ObjectId().toString();

  const completedQuote = await CompletedQuote.create({
    user_id: testUserId,
    quote: "Stay focused",
    day_number: "Day-1"
  });

  testCompletedQuoteId = completedQuote._id.toString();
});

describe("Completed Quotes API (No Auth)", () => {

  it("Should add a completed quote for a user", async () => {
    const res = await request(app)
      .post(`/api/completedQuotes/${testUserId}`)
      .send({
        quote: "Consistency beats motivation"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Quote added successfully");
  });

  it("Should fetch completed quotes by user id", async () => {
    const res = await request(app)
      .get(`/api/completedQuotes/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].quote).toBe("Stay focused");
  });

  it("Should delete all completed quotes for a user", async () => {
    const res = await request(app)
      .delete(`/api/completedQuotes/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Quotes deleted successfully");
    expect(res.body.deletedCount).toBeGreaterThan(0);
  });

  it("Should reject invalid user ID on delete", async () => {
    const res = await request(app)
      .delete(`/api/completedQuotes/123`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid user ID");
  });

});
