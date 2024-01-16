const express = require("express");
const app = express();
const getAllEndpoints = require("./controllers/endpoint-controller");
const { getAllTopics } = require("./controllers/topics-controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require("./controllers/articles-controller");
const errorHandler = require("./middleware/errorHandler");
app.use(express.json());
app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleById);

app.use(errorHandler);

app.all("/*", (req, res) => {
  // if no path matches give default error
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
