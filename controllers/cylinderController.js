const catchAsync = require("../utils/catchAsync");
const Cylinder = require("../models/cylinderModel");
const DuraCylinder = require("../models/duraCylinderModel");
const PermanentPackage = require("../models/permanentPackageModel");
const Order = require("../models/orderModel");
const multer = require("multer");
const readXlsxFile = require('read-excel-file/node')
const createExcel = require("../utils/createExcel");
const Email = require("../utils/email");
// const moment = require("moment-timezone");
const Tracking = require("./../models/trackingModel");
const { format_cylinder_response, format_entity_response } = require("./../utils/formatters/responseFormatters");
const { getIndianDateTimeFromTimeStamp, increaseYearBy5 } = require("./../utils/formatters/dateTimeFormatters");

// const getIndianDateTimeFromTimeStamp = (timestamp) => {
//     const indianTime = moment(timestamp).tz("Asia/Kolkata");

//     const date = indianTime.format("DD-MM-YYYY");
//     const time = indianTime.format("HH:mm:ss");

//     return {date, time};
// }

// const increaseYearBy5 = (date) => {
//     const new_date = new Date(date);
//     new_date.setFullYear(new_date.getFullYear()+5);
//     return new_date;
// }

const ACTIONS = {
    PLANTPICKUP: 0,
    PLANTDELIVERY: 1,
    WAREHOUSEPICKUP: 2,
    WAREHOUSEDELIVERY: 3,
    CLIENTPICKUP: 4,
    CLIENTDELIVERY: 5
}

const createOneEntity = async (data) => {
    try {
        if (!data.owner) {
            data.owner = "Sri Vishnu Speciality Gases";
        }

        if (!data.branch) {
            data.branch = "Hosakote";
        }

        data.status = "empty";
        return await Cylinder.create(data);
    } catch (error) {
        console.log(error);
        return null;
    }
}



exports.createOne = catchAsync(async (req, res, next) => {
    const {
        barcode,
        serial_number,
        product_code,
        volume,
        manufactured_date,
        manufacturer,
        filling_pressure,
        tare_weight,
        test_due_date,
        minimum_thickness,
        usage,
        owner,
        branch,
        valve,
        valve_gaurd
    } = req.body;

    const data = {
        barcode: barcode.toLowerCase(),
        serial_number,
        product_code,
        volume,
        manufactured_date,
        manufacturer,
        filling_pressure,
        tare_weight,
        test_due_date: req.body.test_due_date ? test_due_date : increaseYearBy5(manufactured_date),
        minimum_thickness,
        usage,
        owner,
        branch,
        valve,
        valve_gaurd
    };

    const newOne = await createOneEntity(data);
    if (newOne) {
        res.status(201).json({
            newOne
        })
    } else {
        res.status(400).json({
            "message": "Something went wrong!"
        })
    }
});



// const format_cylinder_response = (data) => {
//     const indian_manufactured_date = getIndianDateTimeFromTimeStamp(data.manufactured_date);
//     const indian_last_test_date = getIndianDateTimeFromTimeStamp(data.last_test_date);
//     const indian_test_due_date = getIndianDateTimeFromTimeStamp(data.test_due_date);

//     const formattedData = {
//         barcode : data.barcode,
//         serial_number :  data.serial_number,
//         product_code :  data.product_code,
//         volume : data.volume,
//         manufactured_date : `${indian_manufactured_date.date}`,
//         manufacturer : data.manufacturer,
//         owner : data.owner,
//         branch : data.branch,
//         status : data.status,
//         batch_number : data.batch_number || "Not assigned yet",
//         filling_pressure :  data.filling_pressure,
//         grade : (data.status === "full" ? data.grade : "Not filled yet"),
//         last_test_date : (data.last_test_date ? `${indian_last_test_date.date}, ${indian_last_test_date.time}` : "Not tested yet"),
//         transaction_status : (data.isDispatched ? "Dispatched" : "In store"),
//         actions : data.currentTrackId?.actions,
//         trackingStatus : data.trackingStatus,
//         tare_weight: data.tare_weight,
//         test_due_date: `${indian_test_due_date.date}`,
//         minimum_thickness: data.minimum_thickness,
//         usage: data.usage,
//         valve: data.valve,
//         valve_gaurd: data.valve_gaurd
//     };

//     return formattedData;
// }

exports.getAll = catchAsync(async (req, res, next) => {
    const limit = req.query.limit;
    const pageNumber = req.query.pageNumber;

    const startIndex = limit * (pageNumber - 1);
    const data = await Cylinder.find().skip(startIndex).limit(limit);
    const formattedData = data.map(cylinder => format_cylinder_response(cylinder));
    res.status(200).json({
        data: formattedData
    })
});

exports.getOne = catchAsync(async (req, res, next) => {
    const data = await Cylinder.findById(req.params.id).populate("currentTrackId");

    if (!data) {
        res.status(404).json({
            "message": "no data is found with that id"
        });

        return;
    }

    res.status(200).json({
        data: format_cylinder_response(data)
    })
});

exports.deleteOne = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const deleted = await Cylinder.findByIdAndDelete(id);

    res.status(204).json({
        "message": "deleted successfully"
    })
});

exports.getOneByBarCode = catchAsync(async (req, res) => {
    const barcode = req.params.barcode.toLowerCase();
    const data = await Cylinder.findOne({ barcode }).populate("currentTrackId");

    if (!data) {
        res.status(404).json({
            "message": "Unable to find anything with this barcode"
        })
        return;
    }

    res.status(200).json({
        data: format_cylinder_response(data)
    })
});

exports.deleteOneByBarcode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const deletedMaterial = await Cylinder.deleteOne({ barcode });

    res.status(204).json({
        "message": "deleted successfully"
    })
});

exports.getAllReport = catchAsync(async (req, res, next) => {
    const userEmail = req.user.email;

    //0. Fetch materials data
    const data = await Cylinder.find();

    const headers = [
        { key: "barcode", header: "Barcode" },
        { key: "serial_number", header: "Serial Number" },
        { key: "product_code", header: "Product code" },
        { key: "volume", header: "Volume" },
        { key: "manufactured_date", header: "Manufactured Date" },
        { key: "manufacturer", header: "Manufacturer" },
        { key: "owner", header: "Owner" },
        { key: "branch", header: "Branch" },
        { key: "status", header: "Status" },
        { key: "filling_pressure", header: "Filling Pressure" },
        { key: "grade", header: "Grade" },
        { key: "batch_number", header: "Batch Number" },
        { key: "last_test_date", header: "Last Test Date" },
        { key: "tare_weight", header: "Tare Weight" },
        { key: "test_due_date", header: "Test Due Date" },
        { key: "minimum_thickenss", header: "Minimum Thickness" },
        { key: "usage", header: "Usage" },
        { key: "valve", header: "valve" },
        { key: "valve_gaurd", header: "valve gaurd" }
    ];

    //1. create excel sheet
    const workbookName = `Cylinders_Report_${Date.now()}_${req.user._id}`;
    const excelFilePath = await createExcel(workbookName, headers, data);
    //2. send that excel sheet as email
    const Emailer = new Email(req.user, "some url");

    const attachments = [{
        path: excelFilePath
    }]
    await Emailer.sendMaterialsReport(attachments);
    //3. delete the excel file (can be taken care later)


    //4. send response
    res.status(200).json({
        "message": "email sent successfully"
    })
});

const fillerEntryHelper = async (cylinder, data, res) => {
    if (!cylinder) {
        return res.status(404).json({
            "message": "No such material exists with given id or barcode"
        });
    }
    if (cylinder.status === "full") {
        return res.status(400).json({
            "message": "Cylinder is already filled"
        })
    }
    if (
        // !data.filling_pressure || 
        !data.grade ||
        !data.batch_number
    ) {
        console.log("Not sufficient information. Missing some fields");
        return res.status(400).json({
            "message": "Missing few field entries"
        });

    }
    try {
        data.status = "full";
        data.trackingStatus = 1;
        const updated = await Cylinder.findByIdAndUpdate(cylinder._id, data, { new: true });
        return res.status(200).json({
            "message": "succesfully updated",
            updated: format_cylinder_response(updated)
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            "message": "Something went wrong"
        })
    }
}

exports.fillerEntry = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const {
        // filling_pressure, 
        grade,
        batch_number
    } = req.body;

    const cylinder = await Cylinder.findById(id);
    const data = {
        // filling_pressure, 
        grade,
        batch_number
    };
    return await fillerEntryHelper(cylinder, data, res);
});

exports.fillerEntryByBarcode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const {
        // filling_pressure, 
        grade,
        batch_number
    } = req.body;

    const cylinder = await Cylinder.findOne({ barcode });
    const data = {
        // filling_pressure, 
        grade,
        batch_number
    };
    return await fillerEntryHelper(cylinder, data, res);
});

exports.testerEntry = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const testUpdated = await Cylinder.findByIdAndUpdate(id, { last_test_date: Date.now() }, { new: true });

    res.status(200).json({
        "message": "tested successfully",
        data: format_cylinder_response(testUpdated)
    })
});

exports.testerEntryByBarcode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const testUpdated = await Cylinder.findOneAndUpdate({ barcode }, { last_test_date: Date.now() }, { new: true });
    res.status(200).json({
        "message": "tested successfully",
        data: format_cylinder_response(testUpdated)
    })
});

const cylinderStatusHelper = async (cylinder, res) => {
    if (!cylinder) {
        return res.status(404).json({
            "message": "No cylinder found with that id or barcode"
        })
    }
    try {
        let status = {};
        status.status = cylinder.status;
        status.isDispatched = cylinder.isDispatched;
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            "message": "something went wrong"
        })
    }
}

const getEntityAndType = async (barcode) => {
    console.log("In getEntityAndType")
    console.log(barcode);
    const cylinderSearch = await Cylinder.findOne({ barcode });
    console.log("cylinderSearch", cylinderSearch)
    if (cylinderSearch) {
        return {
            entityData: cylinderSearch,
            type: "cylinder"
        }
    }

    const duraCylinderSearch = await DuraCylinder.findOne({ barcode });
    console.log("duraCylinderSearch", duraCylinderSearch)
    if (duraCylinderSearch) {
        return {
            entityData: duraCylinderSearch,
            type: "duraCylinder"
        }
    }

    const permanentPackageSearch = await PermanentPackage.findOne({ barcode });
    console.log("permanentPackageSearch", permanentPackageSearch)
    if (permanentPackageSearch) {
        return {
            entityData: permanentPackageSearch,
            type: "permanentPackage"
        }
    }

    return { entityData: null, type: null };
}

const checkTrackingStatusMatchesActionType = (trackingStatus, actionType) => {
    switch (actionType) {
        case "plantpickup":
            return trackingStatus === ACTIONS.PLANTDELIVERY;
        case "plantdelivery":
            return trackingStatus === ACTIONS.CLIENTPICKUP || trackingStatus === ACTIONS.WAREHOUSEPICKUP;
        case "warehousepickup":
            return trackingStatus === ACTIONS.WAREHOUSEDELIVERY;
        case "warehousedelivery":
            return trackingStatus === ACTIONS.PLANTPICKUP || trackingStatus === ACTIONS.CLIENTPICKUP;
        case "clientpickup":
            return trackingStatus === ACTIONS.CLIENTDELIVERY;
        case "clientdelivery":
            return trackingStatus === ACTIONS.PLANTPICKUP || trackingStatus === ACTIONS.WAREHOUSEPICKUP;
        default:
            return false;
    }

}

const pickUpEntryByBarcodeHelper = async (barcode, req, res) => {
    //metadata has location : {latitude, longitude}
    const { actionType, location, metadata } = req.body;
    const { entityData, type } = await getEntityAndType(barcode);

    if (!actionType || !location) {
        res.status(400).json({
            "message": "Bad request, need actionType and location"
        })
        throw new Error("Bad request, need actionType and location");
    }
    if (!entityData) {
        res.status(404).json({
            "message": "No such material exists with given id or barcode"
        });
        throw new Error("No such material exists with given id or barcode");
    }

    const currTrackingStatus = entityData.trackingStatus;
    if (ACTIONS[actionType.toUpperCase()] === ACTIONS.PLANTPICKUP && entityData.status === "empty") {
        res.status(400).json({
            "message": `Can't be dispatched, because the entity is empty - ${barcode}`
        })
        throw new Error(`Can't be dispatched, because the entity is empty - ${barcode}`);
    }

    const isStatusValid = checkTrackingStatusMatchesActionType(currTrackingStatus, actionType);
    if (!isStatusValid) {
        res.status(400).json({
            "message": `Invalid tracking status for the action type. Current status is ${Object.keys(ACTIONS).find(key => ACTIONS[key] === currTrackingStatus)} for ${barcode}`
        })
        throw new Error(`Invalid tracking status for the action type. Current status is ${Object.keys(ACTIONS).find(key => ACTIONS[key] === currTrackingStatus)} for ${barcode}`);
    }

    const currentDate = getIndianDateTimeFromTimeStamp(Date.now());
    const trackingData = {
        date: currentDate.date,
        time: currentDate.time,
        performedBy: req.user.email,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        action: actionType
    }

    entityData.trackingStatus = ACTIONS[actionType.toUpperCase()];
    const newTrackingStatus = ACTIONS[actionType.toUpperCase()];

    entityData.trackingStatus = newTrackingStatus;

    if (newTrackingStatus === ACTIONS.PLANTPICKUP) {
        const billId = req.body.billId;
        if (!billId) {
            res.status(400).json({
                "message": "Bad request, need bill Id"
            })
            throw new Error("Bad request, need bill Id");
        }

        const tracking = await Tracking.create({
            cylinderId: entityData._id,
            billId: billId,
            actions: [trackingData]
        });
        entityData.currentTrackId = tracking._id;
        entityData.isDispatched = true;

        await entityData.save();
    } else {
        const tracking = await Tracking.findById(entityData.currentTrackId);
        tracking.actions.push(trackingData);

        switch (newTrackingStatus) {
            case ACTIONS.PLANTDELIVERY:
                break;
            case ACTIONS.CLIENTDELIVERY:
                break;
            case ACTIONS.WAREHOUSEPICKUP:
                break;
            case ACTIONS.CLIENTPICKUP:
                metadata?.shouldMarkEmpty && (entityData.status = "empty");
                break;
            case ACTIONS.WAREHOUSEDELIVERY:
                break;
            default:
                res.status(400).json({
                    "message": "Invalid action type"
                })
                throw new Error("Invalid action type");
        }

        await tracking.save();
        await entityData.save();
    }
    console.log(type);
    return format_entity_response(entityData, type)
};

exports.pickUpEntryByBarcode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();

    const entityResponse = await pickUpEntryByBarcodeHelper(barcode, req, res);
    res.status(200).json({
        "message": "transaction successful",
        data: entityResponse
    })
})

const format_trackings = (el) => {
    return `Cylinder ${el.action} at ${el.date} and ${el.time} by ${el.performedBy} from (${el.latitude},${el.longitude})`
}
exports.getCylinderTransactionHistory = catchAsync(async (req, res, next) => {
    // let filter = {barcode : req.query.barcode, _id : req.query.materialId};
    let filter = {};
    if (req.query.barcode) {
        filter = { barcode: req.query.barcode.toLowerCase() }
    } else if (req.query.materialId) {
        filter = { _id: req.query.materialId }
    } else {
        return res.status(400).json({
            "message": "need some query parameter"
        })
    }
    const cylinder = await Cylinder.findOne(filter);
    const trackings = await Tracking.find({ cylinderId: cylinder._id }).sort("createdAt");
    const headers = [
        { key: "sno", header: "Serial Number", width: 10 },
        { key: "action1", header: "Action-1", width: 100 },
        { key: "action2", header: "Action-2", width: 100 },
        { key: "action3", header: "Action-3", width: 100 },
        { key: "action4", header: "Action-4", width: 100 },

    ];
    const modifiedOrders = trackings.map((tracking, idx) => {

        return {
            sno: idx + 1,
            action1: tracking.actions.length > 0 ? format_trackings(tracking.actions[0]) : "-",
            action2: tracking.actions.length > 1 ? format_trackings(tracking.actions[1]) : "-",
            action3: tracking.actions.length > 2 ? format_trackings(tracking.actions[2]) : "-",
            action4: tracking.actions.length > 3 ? format_trackings(tracking.actions[3]) : "-"
        }
    });

    const current_date_time = getIndianDateTimeFromTimeStamp(Date.now());

    const workbookName = `${cylinder.barcode}_${current_date_time.date}_${current_date_time.time}`;
    const excelFilePath = await createExcel(workbookName, headers, modifiedOrders);
    const Emailer = new Email(req.user, "some url");

    const attachments = [{
        path: excelFilePath
    }]
    await Emailer.sendMaterialsReport(attachments);
    res.status(200).json({
        "message": "email sent succesfully",
    })
})

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // user-3459923fdg-3334556474.jpeg
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    cb(null, true);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadExcel = upload.single('document');

exports.createWithExcel = catchAsync(async (req, res, next) => {

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
                barcode: `${element[0]}`.toLowerCase(),
                serial_number: `${element[1]}`.toLowerCase(),
                product_code: element[2],
                volume: element[3],
                manufactured_date: element[4],
                manufacturer: element[5],
                owner: element[6],
                branch: element[7],
                filling_pressure: element[8],
                tare_weight: element[9],
                minimum_thickness: element[10],
                usage: element[11] || "",
                valve: element[12] || "",
                valve_guard: element[13] || "",
                test_due_date: increaseYearBy5(element[4])
            }
            data.push(obj);
            const cylinderData = await (Cylinder.findOne({ barcode: obj.barcode }));
            return (cylinderData);
        })

        const repeated_cylinders = await Promise.all(promises);
        const repeated_cylinders_data = [];
        repeated_cylinders.forEach(element => {
            if (element != null) {
                repeated_cylinders_data.push(element.barcode);
                repeated_length = repeated_length + 1;
            }
        })

        repeated_barcodes = repeated_cylinders_data.join(", ");
        console.log(repeated_cylinders_data);

        data.forEach(async (el) => {
            try {
                // const existingCylinder = await Cylinder.findOne({barcode: el.barcode});
                // console.log("here");
                // console.log(repeated_cylinders_data.includes(el.barcode));
                if (repeated_cylinders_data.includes(el.barcode.toLowerCase())) {
                    //Leave it
                } else {
                    await Cylinder.create(el);
                }
                // if(existingCylinder !== null) {
                //     repeated_cylinders_data.push(el.barcode);
                // } else {
                //     await Cylinder.create(el);
                // }
            } catch (error) {
                console.log(error);
            }
        })
    });
    if (repeated_barcodes.length !== 0) {
        console.log("Repeated few barcodes");
        res.status(201).json({
            "message": "Few barcodes are repeated",
            repeated_barcodes_message: repeated_barcodes,
            repeated_barcodes_num: repeated_length
        });
        return;
    }

    // console.log("No repeated barcodes");
    res.status(201).json({
        "message": "created successfuly",
        repeated_barcodes_num: 0,
        repeated_barcodes_message: ""
    })
});

exports.bulkPickup = catchAsync(async (req, res, next) => {
    const { barcodes, pickUpData, action } = req.body;
    console.log(barcodes);
    console.log("req body", req.body);
    const getPromises = barcodes.map(async (barcode) => {
        const entityResponse = await getEntityAndType(barcode);
        return {entityResponse, barcodeInput: barcode};
    });
    const entitiesData = await Promise.all(getPromises);
    const notFoundEntities = entitiesData.filter(entity => entity.entityResponse.entityData === null);
    // console.log("entites data", entitiesData);
    // console.log("not found entities" , notFoundEntities);
    if(notFoundEntities.length > 0) {
        res.status(404).json({
            "message": `Barcodes not found ${notFoundEntities.map(entity => entity.barcodeInput)?.join(", ")}`,
        })
        throw new Error(`No such entity exists with given barcode - ${",".join(notFoundEntities)}`);
    }
    const promises = barcodes.map(async (barcode) => {
        const entityResponse = await pickUpEntryByBarcodeHelper(barcode, req, res);
        return entityResponse;
    });

    const entities = await Promise.all(promises);
    console.log(entities);
    res.status(200).json({
        "message": "transaction successful",
        data: entities
    })
})


exports.getPickupStatusBarCode = catchAsync(async (req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const { entityData, type } = await getEntityAndType(barcode);
    const response = {
        status : entityData?.status,
        type,
        currTrackingStatus: Object.keys(ACTIONS).find(key => ACTIONS[key] === entityData?.trackingStatus),
    }
    if(response.currTrackingStatus === undefined) {
        response.currTrackingStatus = "";
    }
    if (!entityData) {
        res.status(404).json({
            "message": "No such entity exists with given barcode"
        })
    }
    res.status(200).json({
        response
    })
})