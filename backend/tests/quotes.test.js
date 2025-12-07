const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const Quote = require("../models/Quote");

let mongoServer;
let testQuoteId;

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
  await Quote.deleteMany();

  const quote = await Quote.create({
    quote_text: "Be consistent",
    status: "Pending"
  });

  testQuoteId = quote._id.toString();
});

describe("Quotes API (No Auth)", () => {

  it("Should get all quotes", async () => {
    const res = await request(app).get("/api/quotes");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("Should get quote by id", async () => {
    const res = await request(app).get(`/api/quotes/${testQuoteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", testQuoteId);
  });

  it("Should create a new quote", async () => {
    const res = await request(app)
      .post("/api/quotes")
      .send({
        quote_text: "Stay disciplined"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("quote_text", "Stay disciplined");
    expect(res.body.status).toBe("Pending");
  });

  it("Should update a quote", async () => {
    const res = await request(app)
      .put(`/api/quotes/${testQuoteId}`)
      .send({
        quote_text: "Updated quote",
        status: "Completed"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.quote_text).toBe("Updated quote");
    expect(res.body.status).toBe("Completed");
  });

  it("Should delete a quote", async () => {
    const res = await request(app)
      .delete(`/api/quotes/${testQuoteId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Quote deleted successfully");
  });

});
