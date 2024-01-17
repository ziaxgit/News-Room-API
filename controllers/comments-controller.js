const { deleteCommentByIdModel } = require("../models/comments-model");

function deleteCommentById(req, res, next) {
  deleteCommentByIdModel(req.params.comment_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err));
}

module.exports = { deleteCommentById };
