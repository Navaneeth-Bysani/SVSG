const catchAsync = require("./../utils/catchAsync");
const {format_cylinder_response, format_dura_cylinder_response} = require("./../utils/formatters/responseFormatters");
const Cylinder = require("./../models/cylinderModel");
const DuraCylinder = require("../models/duraCylinderModel");
const PermanentPackage = require("../models/permanentPackageModel");

exports.getOneByBarcode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const resource = {data : {}, type : ""};
    const cylinder = await Cylinder.findOne({barcode : barcode});
    console.log(1);
    if(cylinder != null) {
        resource.data = format_cylinder_response(cylinder);
        resource.type = "cylinder";
    } else {
        const duraCylinder = await DuraCylinder.findOne({barcode : barcode});
        if(duraCylinder != null) {
            resource.data = format_dura_cylinder_response(duraCylinder);
            resource.type = "duraCylinder";
        } else {
            const permanentPackage = await PermanentPackage.findOne({barcode:barcode});
            if(permanentPackage != null) {
                resource.data = permanentPackage;
                resource.type = "permanentPackage";
            }
        }
    }
    console.log(2);
    if(resource.type === "") {
        console.log(3);
        res.status(404).json({
            "message" : "not found"
        });
    } else {
        res.status(200).json({
            resource
        })
    }
})