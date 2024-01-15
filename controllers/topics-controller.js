const { allTopicsModel } = require("../models/topics-model");

function getAllTopics(req, res, next) {
  allTopicsModel()
    .then((data) => {
      res.status(200).send({ topics: data });
    })
    .then((err) => {
      next(err);
    });
}

module.exports = { getAllTopics };
