const request = require("supertest");
const app = require("../server"); // you may need to export app in server.js

describe("Users API", () => {
  it("should fetch all users", async () => {
    const res = await request("http://localhost:5000").get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should fetch a user by ID", async () => {
    const all = await request("http://localhost:5000").get("/api/users");
    const firstId = all.body[0]?._id;
    if (firstId) {
      const res = await request("http://localhost:5000").get(`/api/users/${firstId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("_id", firstId);
    }
  });
});
