const { fetchAllUsers, fetchUser } = require("../models/users-model");

function getAllUsers(req, res, next) {
  fetchAllUsers()
    .then((data) => res.status(200).send({ users: data }))
    .catch((err) => next(err));
}

function getUserByUsername(req, res, next) {
  fetchUser(req.params.username)
    .then((data) => res.status(200).send({ user: data }))
    .catch((err) => next(err));
}

module.exports = { getAllUsers, getUserByUsername };
