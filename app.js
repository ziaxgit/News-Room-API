const express = require("express");
const app = express();

const { getAllTopics } = require("./controllers/topics-controller");
const getAllEndpoints = require("./controllers/endpoint-controller");

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);

app.use((req, res) => {
  // if not path matches give default error
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
