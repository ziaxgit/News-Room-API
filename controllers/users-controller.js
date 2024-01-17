const { fetchAllUsers } = require("../models/users-model");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((data) => res.status(200).send({ users: data }))
    .catch((err) => next(err));
}

module.exports = { getAllUsers };
