// tests/setup.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

beforeAll(async () => {
  console.log("🧪 Connecting to MongoDB for testing...");

  const dbUri =
    process.env.MONGO_URI_TEST ||
    process.env.MONGO_URI ||
    "mongodb://127.0.0.1:27017/coopconnect_test";

  try {
    const conn = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`✅ MongoDB Connected for tests: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      await mongoose.connection.dropDatabase();
      console.log("🧹 Dropped test database.");
    } catch (err) {
      console.warn("⚠️ Could not drop test DB:", err.message);
    }
  }

  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed after tests.");
});
