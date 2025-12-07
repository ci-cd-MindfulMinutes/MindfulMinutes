const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const CompletedBreathingExercise = require("../models/CompletedBreathingExercise");

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
  await CompletedBreathingExercise.deleteMany();
  testUserId = new mongoose.Types.ObjectId().toString();
});

describe("Completed Breathing Exercise API (No Auth)", () => {

  it("Should add a completed breathing exercise for a user", async () => {
    const res = await request(app)
      .post(`/api/completedBreathingExercises/${testUserId}`)
      .send({
        exercise_title: "Deep Breathing"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Breathing exercise completed successfully");

    const records = await CompletedBreathingExercise.find({ user_id: testUserId });
    expect(records.length).toBe(1);
    expect(records[0].day_number).toBe(1);
  });

  it("Should fetch completed breathing exercises for a user", async () => {
    await CompletedBreathingExercise.create({
      user_id: testUserId,
      exercise_title: "Box Breathing",
      day_number: 1
    });

    const res = await request(app)
      .get(`/api/completedBreathingExercises/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0].exercise_title).toBe("Box Breathing");
  });

  it("Should delete all completed breathing exercises for a user", async () => {
    await CompletedBreathingExercise.create({
      user_id: testUserId,
      exercise_title: "Relaxed Breathing",
      day_number: 1
    });

    const res = await request(app)
      .delete(`/api/completedBreathingExercises/${testUserId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Breathing Exercises deleted successfully");
    expect(res.body.deletedCount).toBeGreaterThan(0);
  });

  it("Should reject invalid user ID on delete", async () => {
    const res = await request(app)
      .delete(`/api/completedBreathingExercises/123`);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid user ID");
  });

});
