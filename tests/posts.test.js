const request = require("supertest");
require("dotenv").config();
const app = require("../server");

describe("Posts API", () => {
  it("should fetch all posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a post by ID if available", async () => {
    const all = await request(app).get("/api/posts");
    const firstId = all.body[0]?._id;

    if (firstId) {
      const res = await request(app).get(`/api/posts/${firstId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", firstId);
    } else {
      console.warn("⚠️ No post found to test GET by ID.");
    }
  });
});
