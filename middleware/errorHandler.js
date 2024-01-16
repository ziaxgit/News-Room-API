function errorHandler(err, req, res, next) {
  if (err.noArticleFound) {
    res.status(404).send({ message: "Article does not exist" });
  } else if (
    err.code === "22P02" ||
    err.code === "23502" ||
    err.code === "23503"
  ) {
    res.status(400).send({ message: "Bad request" });
  } else if (err.noCommentsFound) {
    res.status(404).send({ message: "No comments found" });
  } else {
    console.log(err);
    res.status(500).send({ message: "Internal server error x_x" });
  }
}

module.exports = errorHandler;
