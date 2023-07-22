const catchAsync = require("../utils/catchAsync");
const Cylinder = require("./../models/cylinderModel");

exports.createCylinder = catchAsync(async (req,res,next) => {
    const {barcode, serial_number, owner, branch, product_code, volume, manufacture_date, manufacturer} = req.body;

    const newCylinder = await Cylinder.create({barcode, serial_number, owner, branch, product_code, volume, manufacture_date, manufacturer});

    res.status(201).json({
        newCylinder
    })
})

exports.getAllCylinders = catchAsync(async (req,res, next) => {
    const cylinders = await Cylinder.find();
    console.log(req.cookies);
    console.log(req.headers);
    res.status(200).json({
        cylinders
    })
})

exports.getCylinder = catchAsync(async (req,res,next) => {
    const cylinder = await Cylinder.findById(req.params.id);
    
    if(!cylinder) {
        res.status(404).json({
            "message" : "no cylinder is found with that id"
        });

        return;
    }

    res.status(200).json({
        cylinder
    })
})

exports.fillerEntry = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const {status, filling_pressure, grade, batch_number} = req.body;

    const updatedCylinder = await Cylinder.findByIdAndUpdate(id, {status, filling_pressure, grade, batch_number}, {new : true});

    if(!updatedCylinder) {
        res.status(404).json({
            "message" : "no cylinder is found with that id"
        });

        return;
    }

    res.status(200).json({
        "message" : "updated successfully",
        updatedCylinder
    })

})

exports.testerEntry = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const {test_date} = req.body;

    const testDateUpdated = await Cylinder.findByIdAndUpdate(id, {last_test_date : test_date}, {new : true});

    res.status(200).json({
        testDateUpdated
    })
})

exports.deleteCylinder = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const deletedCylinder = await Cylinder.findByIdAndDelete(id);

    res.status(200).json({
        "message" : "deleted successfully"
    })
})

exports.getCylinderByBarCode = catchAsync(async (req,res) => {
    const barcode = req.params.barcode;

    const cylinder = await Cylinder.findOne({barcode});

    if(!cylinder) {
        res.status(404).json({
            "message" : "Unable to find cylinder with this barcode"
        })
        return;
    }

    res.status(200).json({
        cylinder
    })
})


exports.fillerEntryByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode;
    const {status, filling_pressure, grade, batch_number} = req.body;

    const updatedCylinder = await Cylinder.findOneAndUpdate({barcode}, {status, filling_pressure, grade, batch_number}, {new : true});

    if(!updatedCylinder) {
        res.status(404).json({
            "message" : "no cylinder is found with that id"
        });

        return;
    }

    res.status(200).json({
        "message" : "updated successfully",
        updatedCylinder
    })

})

exports.testerEntryByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode;
    const {test_date} = req.body;

    const testDateUpdated = await Cylinder.findOneAndUpdate({barcode}, {last_test_date : test_date}, {new : true});

    res.status(200).json({
        testDateUpdated
    })
})

exports.deleteCylinderByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode;
    const deletedCylinder = await Cylinder.deleteOne({barcode});

    res.status(200).json({
        "message" : "deleted successfully"
    })
})