const { allTopicsModel, createNewTopic } = require("../models/topics-model");

function getAllTopics(req, res, next) {
  allTopicsModel()
    .then((data) => {
      res.status(200).send({ topics: data });
    })
    .then((err) => {
      next(err);
    });
}

function postNewTopic(req, res, next) {
  createNewTopic(req)
    .then((data) => {
      res.status(201).send({ topic: data });
    })
    .catch((err) => next(err));
}

module.exports = { getAllTopics, postNewTopic };
