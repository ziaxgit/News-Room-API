const express = require("express");
const articlesRouter = express.Router();

const {
  getArticleById,
  getAllArticles,
  patchArticleById,
  postNewArticle,
  deleteArticleById,
} = require("../controllers/articles-controller");

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments-controller");

articlesRouter.route("/").get(getAllArticles).post(postNewArticle);

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .delete(deleteArticleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
