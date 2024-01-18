const {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
} = require("../models/articles-model");
const { topicValidation } = require("../utils/topicValidation");

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
  Promise.all([topicValidation(req.query.topic), fetchAllArticles(req.query)])
    .then((data) => {
      res.status(200).send({ articles: data[1] });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticleById(req, res, next) {
  updateArticleById(req)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => next(err));
}

module.exports = {
  getArticleById,
  getAllArticles,
  patchArticleById,
};
