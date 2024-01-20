const express = require("express");
const apiRouter = express.Router();

const topicsRouter = require("../routers/topics-router");
const articlesRouter = require("../routers/articles-router");
const commentsRouter = require("../routers/comments-router");
const usersRouter = require("../routers/users-router");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

const getAllEndpoints = require("../controllers/endpoint-controller");

apiRouter.get("/", getAllEndpoints);
module.exports = apiRouter;
