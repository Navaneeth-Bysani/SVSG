const catchAsync = require("../utils/catchAsync");
const DuraCylinder = require("../models/duraCylinderModel");
const Order = require("../models/orderModel");
const multer = require("multer");
const readXlsxFile = require('read-excel-file/node')
const createExcel = require("../utils/createExcel");
const Email = require("../utils/email");
const moment = require("moment-timezone");
const Tracking = require("./../models/trackingModel");
const {format_dura_cylinder_response} = require("./../utils/formatters/responseFormatters");

const getIndianDateTimeFromTimeStamp = (timestamp) => {
    const indianTime = moment(timestamp).tz("Asia/Kolkata");

    const date = indianTime.format("DD-MM-YYYY");
    const time = indianTime.format("HH:mm:ss");

    return {date, time};
}

const increaseYearBy5 = (date) => {
    const new_date = new Date(date);
    new_date.setFullYear(new_date.getFullYear()+5);
    return new_date;
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
        return await DuraCylinder.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}



exports.createOne = catchAsync(async (req,res,next) => {
    console.log("here");
    const {
        barcode, 
        serial_number, 
        volume, 
        tare_weight,
        test_due_date,
        valve,
        trv,
        level_gauge,
        pressure_gauge,
        make,
        frame,
        adaptor,
        service 
    } = req.body;

    const data = {
        barcode: barcode.toLowerCase(), 
        serial_number, 
        volume, 
        tare_weight,
        test_due_date,
        valve,
        trv,
        level_gauge,
        pressure_gauge,
        make,
        frame,
        adaptor,
        service 
    };

    const newOne = await createOneEntity(data);
    console.log(newOne);
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
    const limit = req.query.limit;
    const pageNumber = req.query.pageNumber;

    const startIndex = limit*(pageNumber-1);
    const data = await DuraCylinder.find().skip(startIndex).limit(limit);
    const formattedData = data.map(cylinder => format_dura_cylinder_response(cylinder));
    res.status(200).json({
        data : formattedData
    })
});

exports.getOne = catchAsync(async (req,res,next) => {
    const data = await DuraCylinder.findById(req.params.id).populate("currentTrackId");
    
    if(!data) {
        res.status(404).json({
            "message" : "no data is found with that id"
        });

        return;
    }

    res.status(200).json({
        data : format_dura_cylinder_response(data)
    })
});

exports.deleteOne = catchAsync(async (req,res,next) => {
    const id = req.params.id;
    const deleted = await DuraCylinder.findByIdAndDelete(id);

    res.status(204).json({
        "message" : "deleted successfully"
    })
});

exports.getOneByBarCode = catchAsync(async (req,res) => {
    const barcode = req.params.barcode.toLowerCase();
    console.log(barcode);
    const data = await DuraCylinder.findOne({barcode}).populate("currentTrackId");

    if(!data) {
        console.log("Not found");
        res.status(404).json({
            "message" : "Unable to find anything with this barcode"
        })
        return;
    }

    res.status(200).json({
        data : format_dura_cylinder_response(data)
    })
});

exports.deleteOneByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode.toLowerCase();
    const deletedMaterial = await DuraCylinder.deleteOne({barcode});

    res.status(204).json({
        "message" : "deleted successfully"
    })
});

exports.getAllReport = catchAsync(async (req,res,next) => {
    const userEmail = req.user.email;

    //0. Fetch materials data
    const data = await DuraCylinder.find();

    const headers = [
        {key: "barcode", header: "Barcode"},
        {key: "serial_number", header : "Dura Cylinder Serial Number"},
        {key: "volume", header: "Capacity"},
        {key: "status", header:"Status"},
        {key: "grade", header:"Grade"},
        {key: "batch_number", header:"Batch Number"},
        {key: "last_test_date", header:"Last Test Date"},
        {key: "tare_weight", header: "Weight"},
        {key: "test_due_date", header: "Test Due Date"},
        {key: "valve", header: "Valves"},
        {key: "trv", header: "TRV"},
        {key: "level_gauge", header: "Level Gauge"},
        {key: "pressure_gauge", header: "Pressure Gauge"},
        {key: "make", header: "Make"},
        {key: "frame", header: "Frame"},
        {key: "adaptor", header: "Adaptor"},
        {key: "service", header: "Service"}
    ];

    //1. create excel sheet
    const workbookName = `DuraCylinders_Report_${Date.now()}_${req.user._id}`;
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
            "message" : "DuraCylinder is already filled"
        })
    }
    if(
        // !data.filling_pressure || 
        !data.grade || 
        !data.batch_number
    ) {
        console.log("Not sufficient information. Missing some fields");
        return res.status(400).json({
            "message" : "Missing few field entries"
        });
        
    }
    try {
        data.status = "full";
        data.trackingStatus = 1;
        const updated = await DuraCylinder.findByIdAndUpdate(cylinder._id, data, {new:true});
        return res.status(200).json({
            "message" : "succesfully updated",
            updated : format_dura_cylinder_response(updated)
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
    const {
        // filling_pressure, 
        grade, 
        batch_number
    } = req.body;

    const cylinder = await DuraCylinder.findById(id);
    const data = {
        // filling_pressure, 
        grade, 
        batch_number
    };
    return await fillerEntryHelper(cylinder, data, res);
});

exports.fillerEntryByBarcode = catchAsync(async(req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const {
        // filling_pressure, 
        grade, 
        batch_number
    } = req.body;

    const cylinder = await DuraCylinder.findOne({barcode});
    const data = {
        // filling_pressure, 
        grade, 
        batch_number
    };
    return await fillerEntryHelper(cylinder, data, res);
});

exports.testerEntry = catchAsync(async(req,res, next) => {
    const id = req.params.id;
    const testUpdated = await DuraCylinder.findByIdAndUpdate(id, {last_test_date : Date.now()}, {new: true});

    res.status(200).json({
        "message" : "tested successfully",
        data : format_dura_cylinder_response(testUpdated)
    })
});

exports.testerEntryByBarcode = catchAsync(async(req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const testUpdated = await DuraCylinder.findOneAndUpdate({barcode}, {last_test_date : Date.now()}, {new : true});
    res.status(200).json({
        "message" : "tested successfully",
        data : format_dura_cylinder_response(testUpdated)
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


exports.pickUpEntryByBarcode = catchAsync(async(req,res,next) => {
    const barcode = req.params.barcode.toLowerCase();
    const {location} = req.body;
    console.log(req.body);
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    console.log(latitude, longitude);

    const cylinder = await DuraCylinder.findOne({barcode});
    if(!cylinder) {
        return res.status(404).json({
            "message" : "DuraCylinder not found"
        });
    }

    const trackingStatus = cylinder.trackingStatus;
    if(trackingStatus === 0) {
        return res.status(400).json({
            "message" : "Can't be dispatched, because the cylinder is empty"
        })
    };

    const currentDate = getIndianDateTimeFromTimeStamp(Date.now());

    const trackingData = {
        date: currentDate.date,
        time: currentDate.time,
        performedBy: req.user.email,
        latitude: latitude,
        longitude: longitude,
        action: ""
    }

    if(trackingStatus === 1) {
        const billId = req.body.billId;
        if(!billId) {
            return res.status(400).json({
                "message" : "Bad request, need billId"
            })
        }
        // const trackingString = `DuraCylinder dispatched with bill id - ${billId} at ${currentDate.date}, ${currentDate.time} by ${req.user.email} from (${latitude},${longitude})`;
        
        trackingData.action = "dispatched";
        const tracking = await Tracking.create({
            cylinderId : cylinder._id,
            billId: billId,
            actions: [trackingData]
        });
        cylinder.currentTrackId = tracking._id;
        cylinder.isDispatched = true;
        cylinder.trackingStatus = 2;
        await cylinder.save();
    } else if(trackingStatus === 2) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        // const trackingString = `DuraCylinder reached the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "arrived at destination";
        tracking.actions.push(trackingData);
        await tracking.save();
        cylinder.trackingStatus = 3;
        await cylinder.save();
    } else if(trackingStatus === 3) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        // const trackingString = `DuraCylinder picked up from the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "picked up from destination"
        tracking.actions.push(trackingData);
        await tracking.save();
        cylinder.status = "empty";
        cylinder.trackingStatus = 4;
        await cylinder.save();
    } else if(trackingStatus === 4) {
        const tracking = await Tracking.findById(cylinder.currentTrackId);
        // const trackingString = `DuraCylinder reached SVSG at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "reached SVSG";
        tracking.actions.push(trackingData);
        await tracking.save();
        cylinder.isDispatched = false;
        cylinder.trackingStatus = 0;
        cylinder.currentTrackId = null;
        await cylinder.save();
    }

    const fetchedDuraCylinder = await DuraCylinder.findById(cylinder._id).populate("currentTrackId");

    return res.status(200).json({
        "message" : "updated cylinder",
        cylinder: format_dura_cylinder_response(fetchedDuraCylinder)
    })
})

const format_trackings = (el) => {
    return `DuraCylinder ${el.action} at ${el.date} and ${el.time} by ${el.performedBy} from (${el.latitude},${el.longitude})`
}
exports.getDuraCylinderTransactionHistory = catchAsync(async(req,res,next) => {
    // console.log(req.query);
    // let filter = {barcode : req.query.barcode, _id : req.query.materialId};
    let filter = {};
    if(req.query.barcode) {
        filter = {barcode : req.query.barcode.toLowerCase()}
    } else if(req.query.materialId) {
        filter = {_id : req.query.materialId}
    } else {
        return res.status(400).json({
            "message" : "need some query parameter"
        })
    }
    const cylinder = await DuraCylinder.findOne(filter);
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
            action1 : tracking.actions.length > 0 ? format_trackings(tracking.actions[0]) : "-",
            action2 : tracking.actions.length > 1 ? format_trackings(tracking.actions[1]) : "-",
            action3 : tracking.actions.length > 2 ? format_trackings(tracking.actions[2]) : "-",
            action4 : tracking.actions.length > 3 ? format_trackings(tracking.actions[3]) : "-"
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

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'uploads/');
    },
    filename: (req,file,cb) => {
      // user-3459923fdg-3334556474.jpeg
      const ext = file.mimetype.split('/')[1];
      cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req,file,cb) => {
    console.log(file.mimetype);
    // if(file.mimetype.startsWith('image')) {
    //   cb(null, true)
    // }else {
    //   cb(new AppError('Not an image. Upload only image',400),false);
    // }
    console.log("here");
    console.log(req.file);
    cb(null, true);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadExcel = upload.single('document');

exports.createWithExcel = catchAsync(async(req,res,next) => {
    
    const filename = req.file.filename;

    let repeated_barcodes = "";
    

    let repeated_length = 0;
    let repeated_barcodes_data = await readXlsxFile(`uploads/${filename}`).then(async (rows) => {
        // `rows` is an array of rows
        // each row being an array of cells.
        rows.shift();

        let data = [];

        const promises = rows.map(async element => {
            let obj = {
                barcode : element[0].toLowerCase(),
                serial_number: element[1].toLowerCase(),
                volume: element[2],
                tare_weight : element[3],
                valve: element[4] || "",
                test_due_date: element[5],
                trv: element[6],
                level_gauge: element[7],
                pressure_gauge: element[8],
                make: element[9],
                frame: element[10],
                adaptor: element[11],
                service: element[12]
            }
            data.push(obj);
            console.log(obj);
            const cylinderData = await (DuraCylinder.findOne({barcode: obj.barcode}));
            return (cylinderData);
        })

        const repeated_cylinders = await Promise.all(promises);
        const repeated_cylinders_data = [];
        repeated_cylinders.forEach(element => {
            if(element != null) {
                repeated_cylinders_data.push(element.barcode);
                repeated_length = repeated_length + 1;
            }
        })
        
        repeated_barcodes = repeated_cylinders_data.join(", ");
        console.log(repeated_cylinders_data);
        
        data.forEach(async (el) => {
            try {
                if(repeated_cylinders_data.includes(el.barcode.toLowerCase())) {
                    //Leave it
                } else {
                    await DuraCylinder.create(el);
                }
            } catch (error) {
                console.log(error);
            }
        })
    });
    if(repeated_barcodes.length !== 0) {
        console.log("Repeated few barcodes");
        res.status(201).json({
            "message" : "Few barcodes are repeated",
            repeated_barcodes_message : repeated_barcodes,
            repeated_barcodes_num: repeated_length
        });
        return;
    }
    
    res.status(201).json({
        "message" : "created successfuly",
        repeated_barcodes_num: 0,
        repeated_barcodes_message: ""
    })
});