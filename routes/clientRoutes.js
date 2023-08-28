const express = require("express");
const router = express.Router();
const {createClient, getAllClients} = require("./../controllers/clientController");
const {loggedInUser, protect, restrictTo} = require("../controllers/authController");

router.use(protect);

router.post("/", restrictTo("admin"), createClient);
router.get("/", getAllClients);

module.exports = router;