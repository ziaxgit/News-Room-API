const express = require("express");
const topicsRouter = express.Router();
const {
  getAllTopics,
  postNewTopic,
} = require("../controllers/topics-controller");

topicsRouter.route("/").get(getAllTopics).post(postNewTopic);

module.exports = topicsRouter;
