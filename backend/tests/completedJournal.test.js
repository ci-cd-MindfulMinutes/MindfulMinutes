const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const CompletedJournal = require("../models/CompletedJournal");

let mongoServer;
let testUserId;

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
  await CompletedJournal.deleteMany();
  testUserId = new mongoose.Types.ObjectId().toString();
});

describe("Completed Journal API (No Auth)", () => {

  it("Should add a completed journal for a user", async () => {
    const res = await request(app)
      .post(`/api/completedJournal/${testUserId}`)
      .send({
        journal_content: "Today I practiced deep breathing."
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Journal added successfully");

    const records = await CompletedJournal.find({ user_id: testUserId });
    expect(records.length).toBe(1);
    expect(records[0].day_number).toBe(1);
  });

  it("Should fetch completed journals for a user", async () => {
    await CompletedJournal.create({
      user_id: testUserId,
      journal_content: "Feeling relaxed and mindful.",
      day_number: 1
    });

    const res = await request(app)
      .get(`/api/completedJournal/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].journal_content).toBe("Feeling relaxed and mindful.");
  });

  it("Should delete all completed journals for a user", async () => {
    await CompletedJournal.create({
      user_id: testUserId,
      journal_content: "Focus on gratitude.",
      day_number: 1
    });

    const res = await request(app)
      .delete(`/api/completedJournal/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Journals deleted successfully");
    expect(res.body.deletedCount).toBeGreaterThan(0);
  });

  it("Should reject invalid user ID", async () => {
    const res = await request(app)
      .get(`/api/completedJournal/123`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid user ID");
  });

});
