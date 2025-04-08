const express = require("express");
const router = express.Router();
const {
    getOneByBarcode
} = require("../controllers/resourceController");
const {protect} = require("./../controllers/authController");

router.use(protect);

router.get("/:barcode", getOneByBarcode);

module.exports = router;