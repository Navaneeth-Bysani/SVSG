const catchAsync = require("../utils/catchAsync");
const Cylinder = require("../models/cylinderModel");
const Order = require("../models/orderModel");
const multer = require("multer");
const readXlsxFile = require('read-excel-file/node')
const createExcel = require("../utils/createExcel");
const Email = require("../utils/email");
const moment = require("moment-timezone");
const Tracking = require("./../models/trackingModel");

const getIndianDateTimeFromTimeStamp = (timestamp) => {
    const indianTime = moment(timestamp).tz("Asia/Kolkata");

    const date = indianTime.format("DD-MM-YYYY");
    const time = indianTime.format("HH:mm:ss");

    return {date, time};
}

const createOneEntity = async(data) => {
    try {
        if(!data.owner) {
            data.owner = "Sri Vishnu Speciality Gases";
        }

        if(!data.branch) {
            data.branch = "Hosakote";
        }

        data.status = "empty";
        return await Cylinder.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}

exports.createOne = catchAsync(async (req,res,next) => {
    const {
        barcode, 
        serial_number, 
        product_code, 
        volume, 
        manufactured_date, 
        manufacturer 
    } = req.body;

    const data = {
        barcode, 
        serial_number, 
        product_code, 
        volume, 
        manufactured_date, 
        manufacturer 
    };

    const newOne = await createOneEntity(data);

    if(newOne) {
        res.status(201).json({
            newOne
        })
    } else {
        res.status(400).json({
            "message" : "Something went wrong!"
        })
    }  
});

exports.getAll = catchAsync(async (req,res, next) => {
    const data = await Cylinder.find();
    res.status(200).json({
        data
    })
});

const format_cylinder_response = (data) => {
    const indian_manufactured_date = getIndianDateTimeFromTimeStamp(data.manufactured_date);
    const indian_last_test_date = getIndianDateTimeFromTimeStamp(data.last_test_date);
    console.log(data);
    const formattedData = {
        barcode : data.barcode,
        serial_number :  data.serial_number,
        product_code :  data.product_code,
        volume : data.volume,
        manufactured_date : `${indian_manufactured_date.date}`,
        manufacturer : data.manufacturer,
        owner : data.owner,
        branch : data.branch,
        status : data.status,
        batch_number : data.batch_number || "Not assigned yet",
        filling_pressure :  (data.status === "full" ? data.filling_pressure : "Not filled yet"),
        grade : (data.status === "full" ? data.grade : "Not filled yet"),
        last_test_date : (data.last_test_date ? `${indian_last_test_date.date}, ${indian_last_test_date.time}` : "Not tested yet"),
        transaction_status : (data.isDispatched ? "Dispatched" : "In store"),
        actions : data.currentTrackId.actions,
        trackingStatus : data.trackingStatus
    };

    return formattedData;
}
exports.getOne = catchAsync(async (req,res,next) => {
    const data = await Cylinder.findById(req.params.id).populate("currentTrackId");
    
    if(!data) {
        res.status(404).json({
            "message" : "no data is found with that id"
        });

        return;
    }

    res.status(200).json({
        data : format_cylinder_response(data)
    })
});

exports.deleteOne = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const deleted = await Cylinder.findByIdAndDelete(id);

    res.status(200).json({
        "message" : "deleted successfully"
    })
});

exports.getOneByBarCode = catchAsync(async (req,res) => {
    const barcode = req.params.barcode;
    console.log(barcode);
    const data = await Cylinder.findOne({barcode}).populate("currentTrackId");

    if(!data) {
        res.status(404).json({
            "message" : "Unable to find anything with this barcode"
        })
        return;
    }

    res.status(200).json({
        data : format_cylinder_response(data)
    })
});

exports.deleteOneByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode;
    const deletedMaterial = await Cylinder.deleteOne({barcode});

    res.status(200).json({
        "message" : "deleted successfully"
    })
});

exports.getAllReport = catchAsync(async (req,res,next) => {
    const userEmail = req.user.email;

    //0. Fetch materials data
    const data = await Cylinder.find();

    const headers = [
        {key: "barcode", header: "Barcode"},
        {key: "serial_number", header : "Serial Number"},
        {key: "product_code", header: "Product code"},
        {key: "volume", header: "Volume"},
        {key: "manufactured_date", header:"Manufactured Date"},
        {key: "manufacturer", header:"Manufacturer"},
        {key: "owner", header:"Owner"},
        {key: "branch", header:"Branch"},
        {key: "status", header:"Status"},
        {key: "filling_pressure", header:"Filling Pressure"},
        {key: "grade", header:"Grade"},
        {key: "batch_number", header:"Batch Number"},
        {key: "last_test_date", header:"Last Test Date"},
    ];

    //1. create excel sheet
    const workbookName = `Cylinders_Report_${Date.now()}_${req.user._id}`;
    console.log(workbookName);
    const excelFilePath = await createExcel(workbookName, headers, data);
    console.log(excelFilePath);
    //2. send that excel sheet as email
    const Emailer = new Email(req.user, "some url");

    const attachments = [{
        path : excelFilePath
    }]
    await Emailer.sendMaterialsReport(attachments);
    //3. delete the excel file (can be taken care later)


    //4. send response
    res.status(200).json({
        "message" : "email sent successfully"
    })
});

const fillerEntryHelper = async(cylinder, data, res) => {
    if(!cylinder) {
        return res.status(404).json({
            "message" : "No such material exists with given id or barcode"
        });
    }
    if(cylinder.status === "full") {
        return res.status(400).json({
            "message" : "Cylinder is already filled"
        })
    }
    if(!data.filling_pressure || !data.grade || !data.batch_number) {
        console.log("Not sufficient information. Missing some fields");
        return res.status(400).json({
            "message" : "Missing few field entries"
        });
        
    }
    try {
        data.status = "full";
        data.trackingStatus = 1;
        const updated = await Cylinder.findByIdAndUpdate(cylinder._id, data, {new:true});
        return res.status(200).json({
            "message" : "succesfully updated",
            updated : format_cylinder_response(updated)
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            "message" : "Something went wrong"
        })
    }
}

exports.fillerEntry = catchAsync(async(req, res, next) => {
    const id = req.params.id;
    const {filling_pressure, grade, batch_number} = req.body;

    const cylinder = await Cylinder.findById(id);
    const data = {filling_pressure, grade, batch_number};
    return await fillerEntryHelper(cylinder, data, res);
});

exports.fillerEntryByBarcode = catchAsync(async(req, res, next) => {
    const barcode = req.params.barcode;
    const {filling_pressure, grade, batch_number} = req.body;

    const cylinder = await Cylinder.findOne({barcode});
    const data = {filling_pressure, grade, batch_number};
    return await fillerEntryHelper(cylinder, data, res);
});

exports.testerEntry = catchAsync(async(req,res, next) => {
    const id = req.params.id;
    const testUpdated = await Cylinder.findByIdAndUpdate(id, {last_test_date : Date.now()}, {new: true});

    res.status(200).json({
        "message" : "tested successfully",
        data : format_cylinder_response(testUpdated)
    })
});

exports.testerEntryByBarcode = catchAsync(async(req, res, next) => {
    const barcode = req.params.barcode;
    const testUpdated = await Cylinder.findOneAndUpdate({barcode}, {last_test_date : Date.now()}, {new : true});
    res.status(200).json({
        "message" : "tested successfully",
        data : format_cylinder_response(testUpdated)
    })
});

const cylinderStatusHelper = async(cylinder, res) => {
    if(!cylinder) {
        return res.status(404).json({
            "message" : "No cylinder found with that id or barcode"
        })
    }
    try {
        let status = {};
        status.status = cylinder.status;
        status.isDispatched = cylinder.isDispatched;
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            "message" : "something went wrong"
        })
    }
}
exports.cylinderStatus = catchAsync(async(req,res,next) => {
    const id = req.params.id;
});

exports.cylinderStatusByBarcode = catchAsync(async(req,res,next) => {
    const barcode = req.params.barcode;
});

exports.pickUpEntry = catchAsync(async(req,res,next) => {
    const id = req.params.id;
})

exports.pickUpEntryByBarcode = catchAsync(async(req,res,next) => {
    const barcode = req.params.barcode;
    const {location} = req.body;
    console.log(req.body);
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    console.log(latitude, longitude);

    const cylinder = await Cylinder.findOne({barcode});
    if(!cylinder) {
        return res.status(404).json({
            "message" : "Cylinder not found"
        });
    }

    const trackingStatus = cylinder.trackingStatus;
    if(trackingStatus === 0) {
        return res.status(400).json({
            "message" : "Can't be dispatched, because the cylinder is empty"
        })
    };

    const currentDate = getIndianDateTimeFromTimeStamp(Date.now());

    if(trackingStatus === 1) {
        const billId = req.body.billId;
        if(!billId) {
            return res.status(400).json({
                "message" : "Bad request, need billId"
            })
        }
        const trackingString = `Cylinder dispatched with ${billId} at ${currentDate.date}, ${currentDate.time} by ${req.user.email} from (${latitude},${longitude})`;
        const tracking = await Tracking.create({
            cylinderId : cylinder._id,
            actions: [trackingString]
        });
        cylinder.currentTrackId = tracking._id;
        cylinder.isDispatched = true;
        cylinder.trackingStatus = 2;
        await cylinder.save();
    } else if(trackingStatus === 2) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        const trackingString = `Cylinder reached the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        tracking.actions.push(trackingString);
        await tracking.save();
        cylinder.trackingStatus = 3;
        await cylinder.save();
    } else if(trackingStatus === 3) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        const trackingString = `Cylinder picked up from the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        tracking.actions.push(trackingString);
        await tracking.save();
        cylinder.status = "empty";
        cylinder.trackingStatus = 4;
        await cylinder.save();
    } else if(trackingStatus === 4) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        const trackingString = `Cylinder reached SVSG at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        tracking.actions.push(trackingString);
        await tracking.save();
        cylinder.isDispatched = false;
        cylinder.trackingStatus = 0;
        await cylinder.save();
    }

    const fetchedCylinder = await Cylinder.findOne(cylinder._id).populate("currentTrackId");
    return res.status(200).json({
        "message" : "updated cylinder",
        fetchedCylinder
    })
})

exports.getCylinderTransactionHistory = catchAsync(async(req,res,next) => {
    // console.log(req.query);
    // let filter = {barcode : req.query.barcode, _id : req.query.materialId};
    let filter = {};
    if(req.query.barcode) {
        filter = {barcode : req.query.barcode}
    } else if(req.query.materialId) {
        filter = {_id : req.query.materialId}
    } else {
        return res.status(400).json({
            "message" : "need some query parameter"
        })
    }
    const cylinder = await Cylinder.findOne(filter);
    const trackings = await Tracking.find({cylinderId : cylinder._id}).sort("createdAt");
    console.log(trackings);
    const headers = [
        {key: "sno", header: "Serial Number", width : 10},
        {key: "action1", header: "Action-1", width : 100},
        {key: "action2", header: "Action-2", width : 100},
        {key: "action3", header: "Action-3", width : 100},
        {key: "action4", header: "Action-4", width : 100},

    ];
    // console.log(orders);
    const modifiedOrders = trackings.map((tracking, idx) => {
       
        return {
            sno : idx+1,
            action1 : tracking.actions.length > 0 ? tracking.actions[0] : "-",
            action2 : tracking.actions.length > 1 ? tracking.actions[1] : "-",
            action3 : tracking.actions.length > 2 ? tracking.actions[2] : "-",
            action4 : tracking.actions.length > 3 ? tracking.actions[3] : "-"
        }
    });
    
    const current_date_time = getIndianDateTimeFromTimeStamp(Date.now());

    const workbookName = `${cylinder.barcode}_${current_date_time.date}_${current_date_time.time}`;
    const excelFilePath = await createExcel(workbookName, headers, modifiedOrders);
    const Emailer = new Email(req.user, "some url");

    const attachments = [{
        path : excelFilePath
    }]
    await Emailer.sendMaterialsReport(attachments);
    res.status(200).json({
        "message" : "email sent succesfully",
    })
})