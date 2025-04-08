const express = require("express");
const {loggedInUser, protect, restrictTo} = require("../controllers/authController");
const {getEntityByBarcode} = require("../controllers/entityController");

const router = express.Router();

router.use(protect);

router.get("/barcode/:barcode", getEntityByBarcode);

module.exports = router;