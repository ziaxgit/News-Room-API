const fetchEndPointFile = require("../models/endpoint-model");

function getAllEndpoints(req, res, next) {
  fetchEndPointFile()
    .then((data) => {
      res.status(200).send({ allEndpoints: data });
    })
    .catch((err) => {
      next(err);
      // console.log(err);
    });
}

module.exports = getAllEndpoints;
