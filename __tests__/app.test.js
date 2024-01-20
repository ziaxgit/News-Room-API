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
  test("status:404 returns correct error message for any invalid path", () => {
    return request(app)
      .get("/not-a-valid-path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Invalid endpoint. Use /api/ to find a list of available endpoints"
        );
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

describe("GET /api/articles/:article_id", () => {
  test("status:200 returns an article object", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
      });
  });

  test("status:200 returns an article object with correct datatype for each property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("status:200 returns an article object with correct property names", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.article)).toEqual(
          expect.arrayContaining([
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes",
            "article_img_url",
          ])
        );
      });
  });

  test("status:404 returns correct error message when a valid but non-existent id is entered", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("status:400 returns correct error message when an invalid id is entered", () => {
    return request(app)
      .get("/api/articles/invalid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("status:200 returns an articles array", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.articles)).toBe(true);
      });
  });

  test("status:200 returns an array of article objects with the correct property names and datatype", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("status:200 returns articles array sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status:200 returns an array of comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.comments)).toBe(true);
      });
  });

  test("status:200 returns an array of objects with the correct property names and datatype", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: 1,
          });
        });
      });
  });
  test("status:200 returned comments array should be sorted by the most recent comments first", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status:200 returns empty comments array if the given article id does not have any comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
        expect(body.comments.length).toBe(0);
      });
  });
  test("status:404 returns correct error message when a valid but non-existent article id is entered", () => {
    return request(app)
      .get("/api/articles/683/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });

  test("status:400 returns correct error message when an invalid article id is entered", () => {
    return request(app)
      .get("/api/articles/not-an-id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("status:201 inserts a new comment and returns the newly created comment", () => {
    const testObj = {
      username: "butter_bridge",
      body: "I cease to exist for experimental purposes only",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: "I cease to exist for experimental purposes only",
          article_id: 1,
          author: "butter_bridge",
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("status:400 returns correct error message if username field is missing", () => {
    const testObj = {
      body: "a random thought",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if body field is missing", () => {
    const testObj = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if empty body is sent to server", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:404 returns correct error message if non-existent username is given", () => {
    const testObj = {
      username: "test_user",
      body: "I cease to exist for experimental purposes only",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username not found");
      });
  });
  test("status:404 returns correct error message if valid but non-existent article id is given", () => {
    const testObj = {
      username: "butter_bridge",
      body: "I cease to exist for experimental purposes only",
    };
    return request(app)
      .post("/api/articles/6769/comments")
      .send(testObj)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("status:400 returns correct error message if invalid article id is given", () => {
    const testObj = {
      username: "butter_bridge",
      body: "I cease to exist for experimental purposes only",
    };
    return request(app)
      .post("/api/articles/not-valid/comments")
      .send(testObj)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status:200 returns an article object", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 22 })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
      });
  });
  test("status:200 returns updated article object with incremented votes and other properties", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 1, // incremented from 0 to 1
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status:200 returns updated article object with decremented votes and other properties", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ inc_votes: -100 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: -100, // decremented from 0 to -100
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("status:404 returns correct error message when a valid but non-existent article id is entered", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: -10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("status:400 returns correct error message when an invalid article id is entered", () => {
    return request(app)
      .patch("/api/articles/invalid-id")
      .send({ inc_votes: -10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if body does not have any information", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if invalid data is given inside body", () => {
    return request(app)
      .patch("/api/articles/3")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if invalid field (not inc_votes) is entered", () => {
    return request(app)
      .patch("/api/articles/4")
      .send({ invalid_field: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("status:204 returns correct status code after deleting comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("status:404 returns correct error message if there are no comments for a valid, non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/987")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No comments found");
      });
  });
  test("status:400 returns correct error message if invalid comment id is entered", () => {
    return request(app)
      .delete("/api/comments/not-a-valid-comment-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("status:200 returns an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(typeof user).toBe("object");
        });
      });
  });
  test("status:200 each object should have the correct property names and datatype", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("status:200 returns only the articles that match the given query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(1);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: "rogersop",
            title: "UNCOVERED: catspiracy to bring down democracy",
            article_id: 5,
            topic: "cats",
            created_at: expect.any(String),
            votes: 0,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
      });
  });
  test("status:200 returns empty array if given a topic that exists but has no article", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("status:404 returns correct error message if given a topic that does not exist", () => {
    return request(app)
      .get("/api/articles?topic=idontexist")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic not found");
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("status:200 returns article object with added comment_count and correct value", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });
  test("status:200 returns default comment_count 0 if an article has no comments", () => {
    return request(app)
      .get("/api/articles/7")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 7,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: 0,
        });
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("status:200 returns articles sorted by 'created_at' in descending order if sort_by and order is omitted", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status:200 returns articles sorted by the specified column in descending order when order is omitted", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("status:200 returns articles sorted by the specified column in ascending order when order is given", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(13);
        expect(body.articles).toBeSortedBy("author");
      });
  });
  test("status:200 should work if a topic is specified along with sort_by and order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(12);
        expect(body.articles).toBeSortedBy("article_id");
      });
  });
  test("status:400 returns correct message if given invalid column name as sort by", () => {
    return request(app)
      .get("/api/articles?sort_by=sql-injection")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct message if given invalid order name as order", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=possible-sql-injection")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("status:200 returns an user object with correct properties and datatype", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          username: "icellusedkars",
          name: "sam",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        });
      });
  });
  test("status:404 returns correct error message if no user is found by the given username", () => {
    return request(app)
      .get("/api/users/i-dont-exist")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("No user found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("status:200 returns updated comment object with incremented votes and other properties", () => {
    return request(app)
      .patch("/api/comments/6")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 6,
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 10, // incremented from 0 to 10
        });
      });
  });

  test("status:200 returns updated comment object with decremented votes and other properties", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -10 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 1,
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: 6, // decremented from 16 to 6
        });
      });
  });

  test("status:404 returns correct error message when a non-existent comment id is entered", () => {
    return request(app)
      .patch("/api/comments/9182")
      .send({ inc_votes: -10 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Comment not found");
      });
  });
  test("status:400 returns correct error message when an invalid comment id is entered", () => {
    return request(app)
      .patch("/api/comments/invalid-id")
      .send({ inc_votes: -10 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if body does not have any information", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if invalid data is given inside body", () => {
    return request(app)
      .patch("/api/comments/3")
      .send({ inc_votes: "invalid" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if invalid field (not inc_votes) is entered", () => {
    return request(app)
      .patch("/api/comments/4")
      .send({ invalid_field: 3 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("status:201 returns the newly posted article with the expected properties and datatype", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "The world of coding",
      body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
      topic: "cats",
      article_img_url: "a random url",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "butter_bridge",
          title: "The world of coding",
          body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
          topic: "cats",
          article_img_url: "a random url",
          article_id: 14, // new id generated by psql after posting
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("status:201 should use default article_img_url if it's not given", () => {
    const newArticle = {
      author: "rogersop",
      title: "The world of coding",
      body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: "rogersop",
          title: "The world of coding",
          body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
          topic: "mitch",
          article_img_url:
            "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
          article_id: 14, // new id generated by psql after posting
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        });
      });
  });
  test("status:400 returns correct error message if any required fields are not given (missing body)", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "The world of coding",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("status:400 returns correct error message if no body information is sent to server", () => {
    return request(app)
      .post("/api/articles")
      .send()
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe(
          "Missing required fields: author, title, body, topic"
        );
      });
  });
  test("status:404 returns correct error message if given a non-existent author (username)", () => {
    const newArticle = {
      author: "not a author",
      title: "The world of coding",
      body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Username not found");
      });
  });
  test("status:404 returns correct error message if given a non-existent topic", () => {
    const newArticle = {
      author: "butter_bridge",
      title: "The world of coding",
      body: "Coding is very fun when everything works as you expect but not so fun when something does not work and you cannot figure out why. Once you do figure it out it's fun again. Weird huh?",
      topic: "not a topic",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Topic not found");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("status:204 returns correct status code after deleting an article id", () => {
    return request(app).delete("/api/articles/2").expect(204);
  });
  test("status:404 returns correct error message if a valid but non existent article id is entered", () => {
    return request(app)
      .delete("/api/articles/112112")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article does not exist");
      });
  });
  test("status:400 returns correct error message if an invalid article id is entered", () => {
    return request(app)
      .delete("/api/articles/not-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});
