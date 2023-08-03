const express = require("express");
const {getAllOrders} = require("./../controllers/orderController");

const router = express.Router();

const {protect} = require("./../controllers/authController");

router.use(protect);

router.get("/", getAllOrders);




module.exports = router;