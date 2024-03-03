const express = require("express");

const {loggedInUser, 
    protect, 
    restrictTo
} = require("../controllers/authController");

const {createOne, 
    getAll, 
    getOneByBarCode, 
    deleteOneByBarcode,
    updateOneByBarcode,
    updateCylindersofOneByBarcode,
    testerEntry,
    testerEntryByBarcode
} = require("./../controllers/permanentPackageController");

const router = express.Router();

router.use(protect);

router.post("/", restrictTo("admin"), createOne);
router.get("/", getAll);
router.get("/barcode/:barcode", getOneByBarCode);
router.delete("/barcode/:barcode", restrictTo("admin"), deleteOneByBarcode);

router.patch("/barcode/cylinders/:barcode", restrictTo("admin"), updateCylindersofOneByBarcode);
router.patch("/barcode/:barcode", restrictTo("admin"), updateOneByBarcode);

router.patch("/tester/:id", restrictTo("admin", "tester"), testerEntry);
router.patch("/tester/barcode/:barcode", restrictTo("admin", "tester"), testerEntryByBarcode);

module.exports = router;