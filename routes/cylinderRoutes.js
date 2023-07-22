const express = require("express");

const {createCylinder, getAllCylinders, getCylinder, fillerEntry, testerEntry, deleteCylinder, fillerEntryByBarcode, getCylinderByBarCode, testerEntryByBarcode, deleteCylinderByBarcode} = require("../controllers/cylinderController");

const {loggedInUser, protect, restrictTo} = require("./../controllers/authController");
const router = express.Router();

router.get("/barcode/:barcode", getCylinderByBarCode);
router.get("/:id", getCylinder);


router.use(protect);
router.get("/", getAllCylinders);
router.post("/", restrictTo("admin"), createCylinder);

router.patch("/barcode/filler/:barcode", restrictTo("admin", "filler"), fillerEntryByBarcode);
router.patch("/barcode/tester/:barcode", restrictTo("admin", "tester"), testerEntryByBarcode);
router.delete("/barcode/:barcode", restrictTo("admin"), deleteCylinderByBarcode);


router.patch("/filler/:id", restrictTo("admin", "filler"), fillerEntry);
router.patch("/tester/:id", restrictTo("admin", "tester"), testerEntry);
router.delete("/:id", restrictTo("admin"), deleteCylinder);

module.exports = router;