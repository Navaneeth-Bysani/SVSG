const express = require("express");
const router = express.Router();
const {
    getOneByBarcode
} = require("../controllers/resourceController");

router.use(protect);

router.get("/:barcode", getOneByBarcode);

module.exports = router;