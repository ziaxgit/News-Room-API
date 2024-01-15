const db = require("../db/connection");

function allTopicsModel() {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
}

module.exports = { allTopicsModel };
