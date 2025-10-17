// tests/users.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../server");

jest.setTimeout(20000);

describe("Users API", () => {
  let createdUserId;
  let authToken;

  // 🧹 Cleanup after tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should register a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("success");
    createdUserId = res.body.user?._id || null;
  });

  it("should login with registered user", async () => {
    const email = `testlogin${Date.now()}@example.com`;

    // Register user first
    await request(app).post("/api/users").send({
      name: "Login Test",
      email,
      password: "mypassword",
    });

    // Login
    const loginRes = await request(app).post("/api/users/login").send({
      email,
      password: "mypassword",
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty("token");
    authToken = loginRes.body.token;
  });

  it("should get all users (protected route)", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should get one user by ID (protected route)", async () => {
    if (!createdUserId) {
      console.warn("⚠️ No created user found to test by ID.");
      return;
    }

    const res = await request(app)
      .get(`/api/users/${createdUserId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id", createdUserId);
  });
});
