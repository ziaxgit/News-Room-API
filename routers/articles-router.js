const express = require("express");
const articlesRouter = express.Router();

const {
  getArticleById,
  getAllArticles,
  patchArticleById, postNewArticle
} = require("../controllers/articles-controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments-controller");

articlesRouter.route("/").get(getAllArticles).post(postNewArticle)
articlesRouter.get("/:article_id", getArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
