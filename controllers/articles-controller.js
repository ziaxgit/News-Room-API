const { fetchArticleById } = require("../models/articles-model");

function getArticleById(req, res, next) {
  fetchArticleById(req.params.article_id)
    .then((data) => {
      res.status(200).send({ article: data });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById };
