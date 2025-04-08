const Cylinder = require("../models/cylinderModel");
const DuraCylinder = require("../models/duraCylinderModel");
const PermanentPackage = require("../models/permanentPackageModel");

const catchAsync = require("../utils/catchAsync");

exports.getEntityByBarcode = catchAsync(async (req, res) => {
    let { barcode } = req.params;
    barcode = barcode.toLowerCase().trim();

    let entityData = null;
    let entityType = null;

    entityData = await Cylinder.findOne({ barcode });
    if(entityData) {
        entityType = "cylinder";
    }

    if (!entityData) {
        entityData = await DuraCylinder.findOne({ barcode });
        entityType = "duraCylinder";

        if (!entityData) {
            entityData = await PermanentPackage.findOne({ barcode });
            entityType = "permanentPackage";
        }
    }

    if(!entityData) {
        return res.status(404).json({
            status: "fail",
            message: "No entity found with this barcode"
        });
    } else {
        entityData = await entityData.populate("currentTrackId");
        return res.status(200).json({
            data: {
                entityData,
                entityType
            }
        })
    }
})