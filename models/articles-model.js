const db = require("../db/connection");

function fetchArticleById(articleId) {
  const sqlQuery = `SELECT * FROM articles WHERE articles.article_id = $1`;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0
      ? Promise.reject({ status: 404, message: "Article does not exist" })
      : rows[0];
  });
}

function fetchAllArticles() {
  const sqlQuery = `SELECT articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, articles.article_img_url, 
  COUNT(comments.comment_id)::INT as comment_count FROM articles 
  JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;
  return db.query(sqlQuery).then(({ rows }) => rows);
}

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
