const {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
} = require("../models/articles-model");

function getArticleById(req, res, next) {
  fetchArticleById(req.params.article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(req, res, next) {
  fetchAllArticles()
    .then((data) => {
      res.status(200).send({ articles: data });
    })
    .catch((err) => next(err));
}

function getCommentsByArticleId(req, res, next) {
  fetchCommentsByArticleId(req.params.article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => next(err));
}

module.exports = { getArticleById, getAllArticles, getCommentsByArticleId };
