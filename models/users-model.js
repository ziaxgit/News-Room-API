const db = require("../db/connection");
function fetchAllUsers() {
  const sqlQuery = `SELECT * FROM users`;
  return db.query(sqlQuery).then(({ rows }) => rows);
}

module.exports = { fetchAllUsers };
