const db = require("../db/connection");

function usernameValidation(author) {
  return db
    .query(`SELECT * FROM users where username=$1`, [author])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "Username not found",
        });
    });
}

module.exports = { usernameValidation };
