const db = require("../db/connection");

function fetchArticleById(articleId) {
  const sqlQuery = `SELECT a.*, COUNT(c.body)::INT AS comment_count
  FROM articles a
  LEFT JOIN comments c ON a.article_id = c.article_id
  WHERE a.article_id = $1
  GROUP BY a.article_id
  ORDER BY a.created_at DESC;
  `;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0
      ? Promise.reject({ status: 404, message: "Article does not exist" })
      : rows[0];
  });
}

function fetchAllArticles(queryObj) {
  const topic = queryObj.topic;
  if (
    Object.keys(queryObj).length > 0 &&
    !Object.keys(queryObj).includes("topic")
  ) {
    return Promise.reject({ status: 400, message: "Invalid query" });
  }
  let sqlQuery = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at,
  a.votes, a.article_img_url, COUNT(c.comment_id)::INT AS comment_count
  FROM articles a JOIN comments c ON a.article_id = c.article_id`;

  if (topic) {
    sqlQuery += ` WHERE a.topic = '${topic}'`;
  }

  sqlQuery += ` GROUP BY a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url
  ORDER BY a.created_at DESC`;
  return db.query(sqlQuery).then(({ rows }) => {
    return rows;
  });
}

function fetchCommentsByArticleId(articleId) {
  return fetchArticleById(articleId)
    .then((article) => {
      const sqlQuery = `SELECT * FROM 
    articles a JOIN comments c ON a.article_id = c.article_id
    WHERE a.article_id = $1
    ORDER BY c.created_at DESC`;
      return db.query(sqlQuery, [articleId]);
    })
    .then(({ rows }) => rows);
}

function insertCommentByArticleId(req) {
  const values = [req.body.body, req.params.article_id, req.body.username];
  const sqlQuery = `INSERT INTO comments
  (body, article_id, author)
  VALUES
  ($1, $2, $3)
  RETURNING *`;
  return db.query(sqlQuery, values).then(({ rows }) => {
    return rows[0];
  });
}

function updateArticleById(req) {
  return fetchArticleById(req.params.article_id)
    .then(() => {
      const values = [req.body.inc_votes, req.params.article_id];
      const sqlQuery = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;
      return db.query(sqlQuery, values);
    })
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
  updateArticleById,
};
