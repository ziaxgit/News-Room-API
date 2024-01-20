const db = require("../db/connection");

function allTopicsModel() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

function createNewTopic(req) {
  if (!Object.keys(req.body).includes("slug" && "description")) {
    return Promise.reject({
      status: 400,
      message: "Error. Slug and Description field required",
    });
  }
  const { slug, description } = req.body;
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      message: "Error. Slug and Description fields must not be empty",
    });
  }
  const sqlQuery = `INSERT INTO topics
  (slug, description)
  VALUES 
  ($1, $2)
  RETURNING *`;
  return db.query(sqlQuery, [slug, description]).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { allTopicsModel, createNewTopic };
