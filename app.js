const express = require("express");
const app = express();
const getAllEndpoints = require("./controllers/endpoint-controller");
const { getAllTopics } = require("./controllers/topics-controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/articles-controller");
const errorHandler = require("./middleware/errorHandler");

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getAllArticles);

app.use(errorHandler);

app.all("/*", (req, res) => {
  // if no path matches give default error
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
