const express = require("express");
const authController = require("../controllers/authController");

const Router = express.Router();

Router.post("/regular-login", authController.regularLogin);

module.exports = Router;