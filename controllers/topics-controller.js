const { allTopicsModel } = require("../models/topics-model");

function getAllTopics(req, res) {
  allTopicsModel().then((data) => {
    res.status(200).send({ topics: data });
  });
}

module.exports = { getAllTopics };
