const request = require("supertest");
const app = require("../app");
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed");
const endpointJson = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// for any path that's not in endpoint
describe("Invalid path", () => {
  test("status:404 returns appropriate message for any invalid path", () => {
    return request(app)
      .get("/not-a-valid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found");
      });
  });
});

describe("GET /api/topics", () => {
  test("status:200 returns an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
      });
  });
  test("status:200 returns an array with 3 objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
      });
  });
  test("status:200 returns an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.topics)).toBe(true);
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});
describe("GET /api", () => {
  test("status:200 returns an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.allEndpoints).toBe("object");
      });
  });
  test("status:200 returns an object describing all the available API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.allEndpoints).toEqual(endpointJson);
      });
  });
});
