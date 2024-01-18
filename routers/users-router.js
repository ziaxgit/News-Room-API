const express = require("express");
const usersRouter = express.Router();

const {
  getAllUsers,
  getUserByUsername,
} = require("../controllers/users-controller");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
