const request = require("supertest");
const app = require("./app.js");
const testData = require("./db/data/test-data/index.js");
const seed = require("./db/seeds/seed.js");

const connection = require("./db/connection.js");
const jest_sorted = require("jest-sorted");
const { TestWatcher } = require("jest");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET /api/topics", () => {
  test("Responds with all topics, each should have slug and descriptipn properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        const topics = res.body.topics;
        expect(topics).toHaveLength(3);
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

describe("GET /api/topics/:article_id", () => {
  describe("Responds with correct article id object", () => {
    test("Test 1 - responds with correct article id object (id 1)", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toMatchObject({
            author: "butter_bridge",
            title: "Living in the shadow of a great man",
            article_id: 1,
            body: "I find this existence challenging",
            topic: "mitch",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
          });
        });
    });
    test("Test 2 - responds with correct article id object (id 10)", () => {
      return request(app)
        .get("/api/articles/10")
        .expect(200)
        .then((res) => {
          const article = res.body.article;
          expect(article).toMatchObject({
            author: "rogersop",
            title: "Seven inspirational thought leaders from Manchester UK",
            article_id: 10,
            body: "Who are we kidding, there is only one, and it's Mitch!",
            topic: "mitch",
            created_at: "2020-05-14T04:15:00.000Z",
            votes: 0,
          });
        });
    });
  });
  test("Responds with 404 if valid, but non existent article ID", () => {
    return request(app)
      .get("/api/articles/0")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Article ID does not exist");
      });
  });
  test("Responds with 400 if non-valid article ID syntax e.g. string", () => {
    return request(app)
      .get("/api/articles/dwarfmongoose")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID - must be a number");
      });
  });
});

describe("GET /api/articles", () => {
  test("Responds with all articles in array, each should have correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Articles sorted by default by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("Responds with array of comments for specified article_id with correct properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("Returns empty array when given article ID has no comments", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toHaveLength(0);
      });
  });
  test("Comments in array sorted by date, descending", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("Returns 404 if article ID doen't exist, but correct syntax", () => {
    return request(app)
      .get("/api/articles/0/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Data not found");
      });
  });
  test("Returns 400 if invalid article ID syntax (uses previous article_id error handling", () => {
    return request(app)
      .get("/api/articles/potatoes/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID - must be a number");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("Responds with posted comment", () => {
    newComment = { username: "rogersop", body: "nice article" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toEqual({
          comment_id: 19,
          body: "nice article",
          article_id: 1,
          author: "rogersop",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("Returns 404 when posting to missing article ID number", () => {
    newComment = { username: "rogersop", body: "nice article" };
    return request(app)
      .post("/api/articles/0/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Data not found");
      });
  });
  test("Returns 400 when invalid syntax of article_id", () => {
    newComment = { username: "rogersop", body: "nice article" };
    return request(app)
      .post("/api/articles/eggs/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID - must be a number");
      });
  });
  test("Returns 404 when invalid username given", () => {
    newComment = { username: "mug", body: "nice article" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Username not found");
      });
  });
  test("Returns 400 if username property not present", () => {
    newComment = { body: "nice article" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("Returns 400 if body property not present", () => {
    newComment = { username: "rogersop" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
  test("Returns 400 if wrong properties given", () => {
    newComment = { username: "rogersop", wrongproperty: "badproperty" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("Returns patched article - adds given votes", () => {
    const articleUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 105,
        });
      });
  });
  test("Returns patched article - minuses given votes", () => {
    const articleUpdate = { inc_votes: -5 };
    return request(app)
      .patch("/api/articles/1")
      .send(articleUpdate)
      .expect(200)
      .then((res) => {
        expect(res.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 95,
        });
      });
  });
  test("Patch returns 404 if article not found but valid syntax", () => {
    const articleUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/0")
      .send(articleUpdate)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Data not found");
      });
  });
  test("Patch returns 400 if article id is invalid syntax", () => {
    const articleUpdate = { inc_votes: 5 };
    return request(app)
      .patch("/api/articles/beans")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID - must be a number");
      });
  });
  test("Patch returns 400 bad request if incorrect object format", () => {
    const articleUpdate = { inc_votestypo: 5 };
    return request(app)
      .patch("/api/articles/1")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad request - invalid patch object");
      });
  });
});

describe("GET /api/users", () => {
  test("Responds with all users, each with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles queries", () => {
  describe("Topic query", () => {
    test("Responds articles filtered by cats", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toHaveLength(1);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: "cats",
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
        });
    });
    test("Responds with empty array if topic in database but no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toHaveLength(0);
        });
    });
    test("Responds with 404 if topic not in databse", () => {
      return request(app)
        .get("/api/articles?topic=bandedmongoose")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Data not found");
        });
    });
  });

  describe("sort_by query", () => {
    test("articles are sorted by query author (default is descending)", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("author", { descending: true });
        });
    });
    test("articles are sorted by query article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("article_id", { descending: true });
        });
    });
    test("articles are sorted by query topic", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("topic", { descending: true });
        });
    });
    test("articles are sorted by query created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("articles are sorted by query votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("articles are sorted by query comment_count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("comment_count", { descending: true });
        });
    });
    test("Returns 404 when sorted by non-existent column", () => {
      return request(app)
        .get("/api/articles?sort_by=mongoose_species")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("Column name not found");
        });
    });
  });
  describe("Order by query", () => {
    test("Returns specified query asc (non default)", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });
    test("Returns 400 if order by not asc or desc", () => {
      return request(app)
        .get("/api/articles?order=biscuit")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe(
            "Invalid order query - must be desc or asc"
          );
        });
    });
  });
});

describe("GET /api/article/:article_id now responds with comment count in addition", () => {
  test("Test 1 - responds with correct article id object (id 1)", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        });
      });
  });
  test("Test 2 - responds with correct article id object where zero comments (id 10)", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then((res) => {
        const article = res.body.article;
        expect(article).toMatchObject({
          author: "rogersop",
          title: "Seven inspirational thought leaders from Manchester UK",
          article_id: 10,
          body: "Who are we kidding, there is only one, and it's Mitch!",
          topic: "mitch",
          created_at: "2020-05-14T04:15:00.000Z",
          votes: 0,
          comment_count: 0,
        });
      });
  });
});
describe("DELETE /comments/:comment_id", () => {
  test("Returns 204, and empty response body", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("Responds with 404 if valid, but non existent comment ID", () => {
    return request(app)
      .delete("/api/comments/0")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Data not found");
      });
  });
  test("Responds with 400 if non-valid comment ID syntax (string)", () => {
    return request(app)
      .delete("/api/comments/slendermongoose")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid ID - must be a number");
      });
  });
});
describe("GET /api", () => {
  test("Responds with json of all available endpoints of api", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        const apiJson = res.body.api;
        expect(apiJson).toEqual({
          "GET /api": {
            description:
              "serves up a json representation of all the available endpoints of the api",
          },
          "GET /api/topics": {
            description: "serves an array of all topics",
            queries: [],
            exampleResponse: {
              topics: [{ slug: "football", description: "Footie!" }],
            },
          },
          "GET /api/topics/:article_id": {
            description: "serves a single article",
            exampleResponse: {
              article: [
                {
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: "1",
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2020-07-09T20:11:00.000Z",
                  votes: 100,
                  comment_count: 11,
                },
              ],
            },
          },
          "GET /api/articles": {
            description: "serves an array of all topics",
            queries: ["author", "topic", "sort_by", "order"],
            exampleResponse: {
              articles: [
                {
                  title: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  created_at: 1527695953341,
                },
              ],
            },
          },
          "GET /api/articles/:article_id/comments": {
            description: "serves an array of comments for a given article",
            exampleResponse: {
              comments: [
                {
                  comment_id: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  votes: 5,
                  created_at: 1527695953341,
                },
              ],
            },
          },
          "POST /api/articles/:article_id/comments": {
            description: "serves an array of the posted comment",
            exampleInputAndResponse: {
              comments: [
                {
                  comment_id: "Seafood substitutions are increasing",
                  topic: "cooking",
                  author: "weegembump",
                  body: "Text from the article..",
                  votes: 5,
                  created_at: 1527695953341,
                },
              ],
            },
          },
          "PATCH /api/articles/:article_id": {
            description:
              "serves an array of the patched article, allowing votes to be changed",
            exampleInput: { inc_votes: 5 },
            exampleResponse: {
              article: [
                {
                  author: "butter_bridge",
                  title: "Living in the shadow of a great man",
                  article_id: "1",
                  body: "I find this existence challenging",
                  topic: "mitch",
                  created_at: "2020-07-09T20:11:00.000Z",
                  votes: 100,
                  comment_count: 11,
                },
              ],
            },
          },
          "GET /api/users": {
            description: "serves an array of all users",
            queries: [],
            exampleResponse: {
              users: [
                {
                  username: "rogersop",
                  name: "paul",
                  avatar_url:
                    "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
                },
              ],
            },
          },
          "DELETE /comments/:comment_id": {
            description: "Deletes a comment by ID, serves empty response",
            queries: [],
            exampleResponse: {
              users: {},
            },
          },
        });
      });
  });
  test("Responds with 404 if invalid endpoint", () => {
    return request(app).get("/apo").expect(404);
  });
});
