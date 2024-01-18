const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const errorHandler = require("./middleware/errorHandler");

app.use(express.json());
app.use("/api", apiRouter);

app.use(errorHandler);

app.all("/*", (req, res) => {
  // if no path matches give default error
  res.status(404).send({ message: "Not Found" });
});

module.exports = app;
