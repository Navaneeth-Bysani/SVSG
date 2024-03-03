const express = require("express");
const router = express.Router();
const {
    getOneByBarcode
} = require("../controllers/resourceController");

router.get("/:barcode", getOneByBarcode);

module.exports = router;