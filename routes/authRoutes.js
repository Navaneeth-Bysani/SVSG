const express = require("express");
const authController = require("../controllers/authController");

const Router = express.Router();

Router.post("/google", authController.login);
Router.post("/regular-login", authController.regularLogin);
// Router.post("/logout", authController.logout);

module.exports = Router;