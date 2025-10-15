const request = require("supertest");
require("dotenv").config();
const app = require("../server");

describe("Contributions API", () => {
  it("should fetch all contributions", async () => {
    const res = await request(app).get("/api/contributions");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a contribution by ID if available", async () => {
    const all = await request(app).get("/api/contributions");
    const firstId = all.body[0]?._id;

    if (firstId) {
      const res = await request(app).get(`/api/contributions/${firstId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", firstId);
    } else {
      console.warn("⚠️ No contribution found to test GET by ID.");
    }
  });
});
