const express = require("express");

const {createOne, getAll, getOne, deleteOne, getOneByBarCode, deleteOneByBarcode, getAllReport, fillerEntry, fillerEntryByBarcode, testerEntry, testerEntryByBarcode} = require("../controllers/cylinderController");

const {loggedInUser, protect, restrictTo} = require("../controllers/authController");
const router = express.Router();

router.get("/barcode/:barcode", getOneByBarCode);
router.get("/report", protect, restrictTo("admin", "store"), getAllReport);
// router.get("/material-report", protect, restrictTo("admin", "store"), getMaterialTransactionHistory);
router.get("/:id", getOne);

router.use(protect);


// router.post("/excel/upload",uploadExcel, createWithExcel);

router.get("/", getAll);
router.post("/", restrictTo("admin"), createOne);

//filler entry
router.patch("/filler/:id", restrictTo("admin", "filler"), fillerEntry);
router.patch("/filler/barcode/:barcode", restrictTo("admin", "filler"), fillerEntryByBarcode);

//tester entry
router.patch("/tester/:id", restrictTo("admin", "tester"), testerEntry);
router.patch("/tester/barcode/:barcode", restrictTo("admin", "tester"), testerEntryByBarcode);


router.delete("/barcode/:barcode", restrictTo("admin"), deleteOneByBarcode);



// router.patch("/store/:id", restrictTo("admin", "store"), storeEntry);
router.delete("/:id", restrictTo("admin"), deleteOne);


module.exports = router;