const db = require("../db/connection");
const { fetchArticleById } = require("../models/articles-model");
const { usernameValidation } = require("../utils/usernameValidation");
const { commentValidation } = require("../utils/commentValidation");
function fetchCommentsByArticleId(articleId) {
  return fetchArticleById(articleId)
    .then(() => {
      const sqlQuery = `SELECT * FROM 
    articles a JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    ORDER BY c.created_at DESC`;
      return db.query(sqlQuery, [articleId]);
    })
    .then(({ rows }) => rows);
}

function insertCommentByArticleId(req) {
  if (!Object.keys(req.body).includes("body" && "username")) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  const values = [req.body.body, req.params.article_id, req.body.username];

  const sqlQuery = `INSERT INTO comments
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`;

  return fetchArticleById(req.params.article_id)
    .then(() => {
      return usernameValidation(req.body.username);
    })
    .then(() => {
      return db.query(sqlQuery, values);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

function deleteCommentByIdModel(commentId) {
  const sqlQuery = `DELETE FROM comments WHERE comment_id = $1`;
  return db.query(sqlQuery, [commentId]).then((result) => {
    if (result.rowCount === 0)
      return Promise.reject({ status: 404, message: "No comments found" });
  });
}

function updateCommentById(req) {
  const votes = req.body.inc_votes;
  const commentId = req.params.comment_id;
  return commentValidation(commentId)
    .then(() => {
      const sqlQuery = `UPDATE comments SET votes = $1 WHERE comment_id = $2 RETURNING *`;
      return db.query(sqlQuery, [votes, commentId]);
    })
    .then(({ rows }) => rows[0]);
}

module.exports = {
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  deleteCommentByIdModel,
  updateCommentById,
};
