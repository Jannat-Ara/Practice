const express = require("express");
const routes = express();
const ProductController = require("../controller/ProductController");

routes.get("/all", ProductController.getAll);

module.exports = routes;