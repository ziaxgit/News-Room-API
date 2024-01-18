const db = require("../db/connection");
function fetchAllUsers() {
  const sqlQuery = `SELECT * FROM users`;
  return db.query(sqlQuery).then(({ rows }) => rows);
}

function fetchUser(username) {
  const sqlQuery = `SELECT * FROM users WHERE username = $1`;
  return db.query(sqlQuery, [username]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "No user found" });
    } else return rows[0];
  });
}

module.exports = { fetchAllUsers, fetchUser };
