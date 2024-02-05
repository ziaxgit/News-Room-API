const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.use(errorHandler);

app.all("/*", (req, res) => {
  // if no path matches give default error
  res.status(404).send({
    message:
      "Invalid endpoint. Use /api/ to find a list of available endpoints",
  });
});

module.exports = app;
