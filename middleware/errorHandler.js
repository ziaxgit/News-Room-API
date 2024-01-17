function errorHandler(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ message: err.message });
  } else if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "23503"
  ) {
    res.status(400).send({ message: "Bad request" });
  } else {
    console.log(err);
    res.status(500).send({ message: "Internal server error x_x" });
  }
}

module.exports = errorHandler;
