const catchAsync = require("../utils/catchAsync");
const Material = require("../models/materialModel");
const Order = require("./../models/orderModel");

exports.createMaterial = catchAsync(async (req,res,next) => {
    const {barcode, equipment_details, moc, size, additional_details, available_quanity, minimum_quantity} = req.body;

    const newMaterial = await Material.create({barcode, equipment_details, moc, size, additional_details, available_quanity, minimum_quantity});

    res.status(201).json({
        newMaterial
    })
})

exports.getAllMaterials = catchAsync(async (req,res, next) => {
    const materials = await Material.find();
    console.log("here");
    res.status(200).json({
        materials
    })
})

exports.getMaterial = catchAsync(async (req,res,next) => {
    const material = await Material.findById(req.params.id);
    
    if(!material) {
        res.status(404).json({
            "message" : "no material is found with that id"
        });

        return;
    }

    res.status(200).json({
        material
    })
})

const makeEntry = async (material, type, orderDetails, quantity, res) => {
    let details = {};
    console.log("here");
    console.log(material, type, orderDetails, quantity)
    if(type === "output") {
        if(material.available_quanity - quantity < material.minimum_quantity) {
            return res.status(400).json({
                "message" : "Available quantity will fall below minimum quantity"
        });

        }

        const {company_name, project_name, material_provided_to} = orderDetails;
        console.log(company_name, project_name, material_provided_to);
        if(!company_name || !project_name || !material_provided_to) {
            // return next (new AppError("company_name (or) project_name (or) material_provided_to input not given", 400))
            console.log("missing");
            res.status(400).json({
                message : "company_name (or) project_name (or) material_provided_to input not given"
            })
            return;
        }
        details = {company_name, project_name, material_provided_to};
        // const {manufacturer_test_certificate_available, sve_tested_material} = orderDetails;
        

        material.available_quanity = material.available_quanity - quantity;

    } else if(type === "input") {
        

        const manufacturer_test_certificate_available = orderDetails.manufacturer_test_certificate_available;
        const sve_tested_material = orderDetails.sve_tested_material;
        console.log(manufacturer_test_certificate_available, sve_tested_material)
        if(manufacturer_test_certificate_available === undefined || !sve_tested_material === undefined) {
            // return next (new AppError("manufacturer test certificate available (or) sve tested material input not given", 400))
            res.status(400).json({
                message : "manufacturer test certificate available (or) sve tested material input not given"
            })
            return;
        }
        details = {manufacturer_test_certificate_available, sve_tested_material};

        material.available_quanity += quantity;
        console.log(material.available_quanity);
    } else {
        return res.status(401).json({
            "message" : "type should be either input or output"
        })
    }

    try {
        await material.save();
        const order = await Order.create({type, quantity,...details, materialId : material._id });
        return res.status(200).json({
            "message" : "successful",
            material,
            order
        })
    } catch(err) {
        console.log(err);
        return res.status(400).json({
            err
        })
    }

    
    
    
}

exports.storeEntry = catchAsync(async (req, res, next) => {
    const {type, quantity, orderDetails} = req.body;
    const id = req.params.id;
    const material = await Material.findById(id);
    console.log(orderDetails);
    if(!material) {
        res.status(404).json({
            "message" : "No item found with that id"
        })
        return;
    }

    return await makeEntry(material, type, orderDetails, quantity, res);
})

exports.deleteMaterial = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const deletedMaterial = await Material.findByIdAndDelete(id);

    res.status(200).json({
        "message" : "deleted successfully"
    })
})

exports.getMaterialByBarCode = catchAsync(async (req,res) => {
    const barcode = req.params.barcode;
    console.log(barcode);
    const material = await Material.findOne({barcode});

    if(!material) {
        res.status(404).json({
            "message" : "Unable to find material with this barcode"
        })
        return;
    }

    res.status(200).json({
        material
    })
})

exports.storeEntryByBarcode = catchAsync(async (req, res, next) => {
    const {type, quantity, orderDetails} = req.body;
    const barcode = req.params.barcode;
    const material = await Material.findOne({barcode});
    console.log(type, quantity, orderDetails)
    if(!material) {
        res.status(404).json({
            "message" : "No item found with that id"
        })
        console.log(`${barcode} not found`)
        return;
    }

   return await makeEntry(material, type, orderDetails, quantity, res);
})

exports.deleteMaterialByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode;
    const deletedMaterial = await Material.deleteOne({barcode});

    res.status(200).json({
        "message" : "deleted successfully"
    })
})