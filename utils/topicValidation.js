const db = require("../db/connection");
function topicValidation(topic) {
  if (topic) {
    return db
      .query("SELECT * FROM topics WHERE slug = $1", [topic])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, message: "Topic not found" });
        }
      });
  }
}

module.exports = { topicValidation };
