const db = require("../db/connection");

function commentValidation(commentId) {
  return db
    .query(`SELECT * FROM comments where comment_id=$1`, [commentId])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "Comment not found",
        });
    });
}

module.exports = { commentValidation };
