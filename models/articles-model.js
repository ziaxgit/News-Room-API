const db = require("../db/connection");

function fetchArticleById(articleId) {
  const sqlQuery = `SELECT * FROM articles WHERE articles.article_id = $1`;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0
      ? Promise.reject({ noArticleFound: true })
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
  const sqlQuery = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM 
  articles JOIN comments ON articles.article_id = comments.article_id
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC`;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0 ? Promise.reject({ noCommentsFound: true }) : rows;
  });
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
module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchCommentsByArticleId,
  insertCommentByArticleId,
};
