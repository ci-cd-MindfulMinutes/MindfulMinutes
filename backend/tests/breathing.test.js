const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");
const BreathingExercise = require("../models/BreathingExercise");

let mongoServer;
let testExerciseId;

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
  await BreathingExercise.deleteMany();

  const exercise = await BreathingExercise.create({
    exercise_title: "Deep Breathing",
    exercise_description: "Breathe in for 4 seconds and out for 4 seconds",
    videoUrl: "https://example.com/video"
  });

  testExerciseId = exercise._id.toString();
});

describe("Breathing Exercise API (No Auth)", () => {

  it("Should get all breathing exercises", async () => {
    const res = await request(app).get("/api/breathingExercise");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
  });

  it("Should get a random breathing exercise", async () => {
    const res = await request(app).get("/api/breathingExercise/random");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", testExerciseId);
  });

  it("Should create a new breathing exercise", async () => {
    const res = await request(app)
      .post("/api/breathingExercise")
      .send({
        exercise_title: "Box Breathing",
        exercise_description: "Breathe in, hold, out, hold",
        videoUrl: "https://example.com/box"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.exercise_title).toBe("Box Breathing");
  });

  it("Should delete a breathing exercise", async () => {
    const res = await request(app)
      .delete(`/api/breathingExercise/${testExerciseId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Exercise deleted successfully");
  });

});
