function errorHandler(err, req, res, next) {
    if (err.articleFound === 0) {
      res.status(404).send({ message: "Article does not exist" });
    } else if ((err.code = "22P02")) {
      res.status(400).send({ message: "Bad request" });
    } else {
      console.log(err);
      res.status(500).send({ message: "Internal server error x_x" });
    }
  }
  
  module.exports = errorHandler;
  