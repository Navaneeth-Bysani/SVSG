const express = require("express");

const router = express.Router();
const {addUser, changeRole, getAllUsers} = require("./../controllers/userController");
const {restrictTo, protect} = require("./../controllers/authController");

router.use(protect);

router.get("/", restrictTo("admin"), getAllUsers);
router.post("/addUser", restrictTo("admin"), addUser);
router.patch("/changeRole/:id", restrictTo("admin"), changeRole);

module.exports = router;