const db = require("../db/connection");

function deleteCommentByIdModel(commentId) {
  const sqlQuery = `DELETE FROM comments WHERE comment_id = $1`;
  return db.query(sqlQuery, [commentId]).then((result) => {
    if (result.rowCount === 0)
      return Promise.reject({ status: 404, message: "No comments found" });
  });
}

module.exports = { deleteCommentByIdModel };
