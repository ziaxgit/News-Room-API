const db = require("../db/connection");

function fetchArticleById(articleId) {
  const sqlQuery = `SELECT * FROM articles WHERE articles.article_id = $1`;
  return db.query(sqlQuery, [articleId]).then(({ rows }) => {
    return rows.length === 0 ? Promise.reject({ articleFound: 0 }) : rows[0];
  });
}

module.exports = { fetchArticleById };
