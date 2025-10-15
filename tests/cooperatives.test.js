const request = require("supertest");
require("dotenv").config();
const app = require("../server");

describe("Cooperatives API", () => {
  it("should fetch all cooperatives", async () => {
    const res = await request(app).get("/api/cooperatives");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a cooperative by ID if available", async () => {
    const all = await request(app).get("/api/cooperatives");
    const firstId = all.body[0]?._id;

    if (firstId) {
      const res = await request(app).get(`/api/cooperatives/${firstId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", firstId);
    } else {
      console.warn("⚠️ No cooperative found to test GET by ID.");
    }
  });
});
