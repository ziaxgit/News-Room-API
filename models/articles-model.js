const db = require("../db/connection");

const { usernameValidation } = require("../utils/usernameValidation");
const { topicValidation } = require("../utils/topicValidation");

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

function createNewArticle(req) {
  if (Object.keys(req.body).length === 0) {
    return Promise.reject({
      status: 400,
      message: "Missing required fields: author, title, body, topic",
    });
  }
  const { body, author, title, topic } = req.body;
  const article_img_url =
    req.body.article_img_url ||
    "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700";

  const sqlQuery = `INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES
  ($1, $2, $3, $4, $5)
  RETURNING *`;

  return topicValidation(topic)
    .then(() => {
      return usernameValidation(author);
    })
    .then(() => {
      return db.query(sqlQuery, [author, title, body, topic, article_img_url]);
    })
    .then(({ rows }) => {
      const newArticleId = rows[0].article_id;
      return fetchArticleById(newArticleId);
    });
}

function deleteArticleModel(articleId) {
  return fetchArticleById(articleId)
    .then(() => {
      const sqlQuery = `DELETE FROM articles WHERE article_id = $1`;
      return db.query(sqlQuery, [articleId]);
    })
    .then(({ rowCount }) => {
      if (rowCount === 0) {
        return Promise.reject({ status: 400, message: "Bad request" });
      }
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  updateArticleById,
  createNewArticle,
  deleteArticleModel,
};
