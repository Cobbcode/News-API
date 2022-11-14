const request = require("supertest");
const app = require("./app.js");
const testData = require("./db/data/test-data/index.js");
const seed = require("./db/seeds/seed.js");
const connection = require("./db/connection.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("Responds with all topics, each should have slug and descriptipn properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(topics).toBeInstanceOf(Array);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
  test("Responds with 404 if invalid endpoint", () => {
    return request(app).get("/api/tos").expect(404);
  });
});

// describe("GET /api/topics/:article_id", () => {
//   test("Responds with correct article id", () => {
//     return request(app)
//       .get("/api/articles/1")
//       .expect(200)
//       .then((res) => {
//         const article = res.body.article_id;
//         expect(articles).toBeInstanceOf(Object);
//         expect(article).toMatchObject({
//           author: expect.any(String),
//           title: expect.any(String),
//           article_id: expect.any(Number),
//           topic: expect.any(String),
//           created_at: expect.any(String),
//           votes: expect.any(Number),
//           comment_count: expect.any(Number),
//         });
//       });
//   });
// });
