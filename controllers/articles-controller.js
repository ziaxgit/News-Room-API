const {
  fetchArticleById,
  fetchAllArticles,
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

module.exports = { getArticleById, getAllArticles };
