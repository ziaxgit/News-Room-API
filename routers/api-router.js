const express = require("express");
const apiRouter = express.Router();

const articlesRouter = require("../routers/articles-router");
const commentsRouter = require("../routers/comments-router");
const usersRouter = require("../routers/users-router");

apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

const getAllEndpoints = require("../controllers/endpoint-controller");
const { getAllTopics } = require("../controllers/topics-controller");

apiRouter.get("/", getAllEndpoints);
apiRouter.get("/topics", getAllTopics);

module.exports = apiRouter;
