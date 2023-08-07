const express = require("express");

const {createMaterial, getAllMaterials, getMaterial, deleteMaterial, getMaterialByBarCode, deleteMaterialByBarcode, storeEntry, storeEntryByBarcode, createWithExcel, uploadExcel} = require("../controllers/materialController");

const {loggedInUser, protect, restrictTo} = require("../controllers/authController");
const router = express.Router();

router.get("/barcode/:barcode", getMaterialByBarCode);
router.get("/:id", getMaterial);

router.use(protect);


router.post("/excel/upload",uploadExcel, createWithExcel);

router.get("/", getAllMaterials);
router.post("/", restrictTo("admin"), createMaterial);

// router.patch("/barcode/store/:barcode", storeEntryByBarcode);
router.patch("/barcode/store/:barcode", restrictTo("admin", "store"), storeEntryByBarcode);
router.delete("/barcode/:barcode", restrictTo("admin"), deleteMaterialByBarcode);


router.patch("/store/:id", restrictTo("admin", "store"), storeEntry);
router.delete("/:id", restrictTo("admin"), deleteMaterial);

module.exports = router;