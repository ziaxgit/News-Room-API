const express = require("express");
const commentsRouter = express.Router();

const {
  deleteCommentById,
  patchCommentByCommentId,
} = require("../controllers/comments-controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteCommentById)
  .patch(patchCommentByCommentId);

module.exports = commentsRouter;
