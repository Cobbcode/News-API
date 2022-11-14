const request = require("supertest");
const app = require("./app.js");
const testData = require("./db/data/test-data/index.js");
const seed = require("./db/seeds/seed.js")

beforeEach(() => seed(testData));

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
                    description: expect.any(String)
                })
            })
        })
    })
    test("Responds with 404 if invalid endpoint", () => {
        return request(app)
        .get("/api/tos")
        .expect(404)
    })
})