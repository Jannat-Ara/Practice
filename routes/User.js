const express = require("express");
const routes = express();
const UserController = require("../controller/userController");
const { userValidator } = require("../middleware/validation_01");

routes.get("/all", UserController.getAll);
routes.get("/detail/:id", UserController.getOneById);
routes.post("/create", userValidator.create, UserController.create);

module.exports = routes;