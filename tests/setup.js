const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // wait up to 10s
    });
    console.log("🧪 Connected to MongoDB for testing...");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB in tests:", err);
    process.exit(1);
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed after tests.");
  } catch (err) {
    console.error("⚠️ Error closing MongoDB connection:", err);
  }
});
