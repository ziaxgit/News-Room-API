const {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentByIdModel,
} = require("../models/comments-model");

function getCommentsByArticleId(req, res, next) {
  fetchCommentsByArticleId(req.params.article_id)
    .then((data) => {
      res.status(200).send({ comments: data });
    })
    .catch((err) => next(err));
}

function postCommentByArticleId(req, res, next) {
  insertCommentByArticleId(req)
    .then((data) => {
      res.status(201).send({ comment: data });
    })
    .catch((err) => next(err));
}

function deleteCommentById(req, res, next) {
  deleteCommentByIdModel(req.params.comment_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
}

module.exports = {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentById,
};
