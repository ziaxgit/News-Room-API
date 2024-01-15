const express = require("express");
const app = express();
const getAllEndpoints = require("./controllers/endpoint-controller");
const { getAllTopics } = require("./controllers/topics-controller");

app.get("/api/topics", getAllTopics);
app.get("/api", getAllEndpoints);

app.all("/*", (req, res) => {
  // if no path matches give default error
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
