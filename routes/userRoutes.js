const express = require("express");

const router = express.Router();
const {addUser, changeRole, getAllUsers, getUserRole, addUserManual, deleteUser} = require("./../controllers/userController");
const {restrictTo, protect} = require("./../controllers/authController");

router.post("/getRole", getUserRole);

router.post("/addUserManual", addUserManual);

router.use(protect);

router.get("/", restrictTo("admin"), getAllUsers);
router.post("/addUser", restrictTo("admin"), addUser);
router.patch("/changeRole", restrictTo("admin"), changeRole);
router.delete("/:email", restrictTo("admin"), deleteUser);
module.exports = router;