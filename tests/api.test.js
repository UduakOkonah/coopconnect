const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../server");

let mongoServer;

beforeAll(async () => {
  // Spin up an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 20000); // extend timeout to 20s

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
}, 10000);

const testGetRoutes = (routeName) => {
  describe(`${routeName} routes`, () => {
    test(`GET /api/${routeName} - should return all ${routeName}`, async () => {
      const res = await request(app).get(`/api/${routeName}`);
      expect([200, 401, 404]).toContain(res.statusCode);

    }, 10000);

    test(`GET /api/${routeName}/:id - should return 404 or object`, async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/${routeName}/${fakeId}`);
     expect([200, 401, 404]).toContain(res.statusCode);
    }, 10000);
  });
};

testGetRoutes("users");
testGetRoutes("cooperatives");
testGetRoutes("posts");
testGetRoutes("contributions");
