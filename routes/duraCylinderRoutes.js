const express = require("express");

const {
    createOne, 
    getAll, 
    getOne, 
    deleteOne, 
    getOneByBarCode, 
    deleteOneByBarcode, 
    getAllReport, 
    fillerEntry, 
    fillerEntryByBarcode, 
    testerEntry, 
    testerEntryByBarcode,
    pickUpEntryByBarcode,
    getDuraCylinderTransactionHistory,
    uploadExcel,
    createWithExcel
} = require("../controllers/duraCylinderController");

const {loggedInUser, protect, restrictTo} = require("../controllers/authController");
const router = express.Router();

router.get("/barcode/:barcode", getOneByBarCode);
router.get("/report", protect, restrictTo("admin"), getAllReport);
router.get("/cylinder-report", protect, restrictTo("admin"), getDuraCylinderTransactionHistory);
router.get("/:id", getOne);

router.use(protect);


router.post("/excel/upload",uploadExcel, createWithExcel);

router.get("/", getAll);
router.post("/", restrictTo("admin"), createOne);

//filler entry
router.patch("/filler/:id", restrictTo("admin", "filler"), fillerEntry);
router.patch("/filler/barcode/:barcode", restrictTo("admin", "filler"), fillerEntryByBarcode);

//tester entry
router.patch("/tester/:id", restrictTo("admin", "tester"), testerEntry);
router.patch("/tester/barcode/:barcode", restrictTo("admin", "tester"), testerEntryByBarcode);

// router.patch("/pickup/:id", restrictTo("admin", "pickup"), )
router.patch("/pickup/barcode/:barcode", restrictTo("admin", "pickup"), pickUpEntryByBarcode);

router.delete("/barcode/:barcode", restrictTo("admin"), deleteOneByBarcode);



// router.patch("/store/:id", restrictTo("admin", "store"), storeEntry);
router.delete("/:id", restrictTo("admin"), deleteOne);


module.exports = router;