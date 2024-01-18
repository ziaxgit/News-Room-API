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
  const sort_by = queryObj.sort_by || "created_at";
  const order = queryObj.order || "DESC";

  const validColumns = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];

  const validOrder = ["asc", "ASC", "desc", "DESC"];

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, message: "Bad request" });
  }

  let sqlQuery = `SELECT a.author, a.title, a.article_id, a.topic, a.created_at,
  a.votes, a.article_img_url, COUNT(c.body)::INT AS comment_count
  FROM articles a
  LEFT JOIN comments c ON a.article_id = c.article_id`;

  const queryParameters = [];
  if (topic) {
    sqlQuery += ` WHERE a.topic = $1`;
    queryParameters.push(topic);
  }

  sqlQuery += ` GROUP BY a.article_id ORDER BY a.${sort_by} ${order}`;

  return db.query(sqlQuery, queryParameters).then(({ rows }) => {
    return rows;
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
  updateArticleById,
};
