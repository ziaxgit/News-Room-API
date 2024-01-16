const db = require("../db/connection");

function fetchArticleById(articleId) {
  const sqlQuery = `SELECT * FROM articles WHERE articles.article_id = $1`;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0 ? Promise.reject({ articleFound: 0 }) : rows[0];
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

module.exports = { fetchArticleById, fetchAllArticles };
