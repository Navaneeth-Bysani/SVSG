const catchAsync = require("../utils/catchAsync");
const PermanentPackage = require("./../models/permanentPackageModel");
const Cylinder = require("./../models/cylinderModel");
const {format_permanent_package_response} = require("./../utils/formatters/responseFormatters");
const Tracking = require("./../models/trackingModel");
const {getIndianDateTimeFromTimeStamp} = require("./../utils/formatters/dateTimeFormatters");

exports.createOne = catchAsync(async(req, res, next) => {
    const {barcode, serial_number, last_test_date, number_of_cylinders, working_pressure, valves, manifold, wheels, service} = req.body;
    const permanentPackageData = {barcode : barcode.toLowerCase(), serial_number, last_test_date, number_of_cylinders, working_pressure, valves, manifold, wheels, service};
    const permanentPackage = await PermanentPackage.create(permanentPackageData);
    
    res.status(201).json({
        "message" : "permanent package created successfully"
    });
})

exports.getAll = catchAsync(async(req, res, next) => {
    const limit = req.query.limit;
    const pageNumber = req.query.pageNumber;

    const startIndex = limit*(pageNumber-1);
    // console.log(limit, pageNumber, startIndex);
    const data = await PermanentPackage.find().skip(startIndex).limit(limit).populate({path:"cylinders", select:"barcode"});
    console.log(data);
    res.status(200).json({
        "message" : "fetched successfully",
        data: data.map(item => format_permanent_package_response(item))
    })
})

exports.getOneByBarCode = catchAsync(async (req,res) => {
    const barcode = req.params.barcode.toLowerCase();
    const data = await PermanentPackage.findOne({barcode}).populate({path:"cylinders", select:"barcode"});

    if(!data) {
        res.status(404).json({
            "message" : "Unable to find anything with this barcode"
        })
        return;
    }

    res.status(200).json({
        data : format_permanent_package_response(data)
    })
});

exports.deleteOneByBarcode = catchAsync(async (req,res,next) => {
    const barcode = req.params.barcode.toLowerCase();
    await PermanentPackage.deleteOne({barcode});

    res.status(204).json({
        "message" : "deleted successfully"
    })
})

function getNextMonthFirstDayTimestamp() {
    // Get the current date
    const currentDate = new Date();
  
    // Check if the current month is December
    if (currentDate.getMonth() === 11) {
      // If so, set the next month to January of the next year
      currentDate.setFullYear(currentDate.getFullYear() + 1);
      currentDate.setMonth(0);
    } else {
      // If not, move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    // Set the day to 1 to get the first day of the next month
    currentDate.setDate(1);
  
    // Set the time to midnight
    currentDate.setHours(0, 0, 0, 0);
  
    // Get the timestamp in milliseconds
    const nextMonthFirstDayTimestamp = currentDate.getTime();
  
    return nextMonthFirstDayTimestamp;
  }

exports.updateCylindersofOneByBarcode = catchAsync(async (req,res,next) => {
    console.log("Came till here");
    const barcode = req.params.barcode.toLowerCase();
    const package = await PermanentPackage.findOne({barcode});

    const cylinders = req.body.cylinders || package.cylinders;
    const number_of_cylinders = req.body.number_of_cylinders || package.number_of_cylinders;


    if(!package) {
        res.status(404).json({
            "message" : "Unable to find anything with this barcode"
        })
        return;
    }

    if(number_of_cylinders !== null && cylinders !== null && (number_of_cylinders !== cylinders.length)) {
        res.status(400).json({
            "message" : "Given cylinders doesn't match the number of cylinders given"
        })
        return;
    }

    const next_month_first_day_timestamp = getNextMonthFirstDayTimestamp();

    console.log(cylinders);
    const promises = cylinders.map(async cylinder => {
        const barcode = cylinder;
        const cylinderData = await Cylinder.findOne({barcode});

        return (cylinderData);
    })

    const results = await Promise.all(promises);
    let need_test = [];
    
    const cylinderIds = [];
    results.forEach(cylinderData => {
        if(cylinderData.test_due_date <= next_month_first_day_timestamp) {
            need_test.push({barcode : cylinderData.barcode, test_due_date : cylinderData.test_due_date});
        }
        cylinderIds.push(cylinderData._id);
    });

    if(need_test.length != 0) {
        res.status(400).json({
            "message" : `The following cylinders needs to be tested. And the update can't be performed`,
            need_test
        })

        return;
    }

    package.cylinders = cylinderIds;
    package.number_of_cylinders = number_of_cylinders;
    
    await package.save();

    res.status(200).json({
        "message" : "updated successfully"
    })
})

exports.updateOneByBarcode = catchAsync(async(req,res,next) => {
    const {working_pressure, valves, manifold, wheels, service, last_test_date} = req.body;
    const barcode = req.params.barcode;
    const updateBody = {working_pressure, valves, manifold, wheels, service, last_test_date};
    const updatedPackage = await PermanentPackage.findOneAndUpdate({barcode}, updateBody, {new: true});
    res.status(200).json({
        updatedPackage
    })
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
    const barcode = req.params.barcode.toLowerCase();
    const testUpdated = await PermanentPackage.findOneAndUpdate({barcode}, {last_test_date : Date.now()}, {new : true});
    res.status(200).json({
        "message" : "tested successfully",
        data : format_permanent_package_response(testUpdated)
    })
});

const fillerEntryHelper = async(item, data, res) => {
    if(!item) {
        return res.status(404).json({
            "message" : "No such material exists with given id or barcode"
        });
    }
    if(item.status === "full") {
        return res.status(400).json({
            "message" : "Cylinder is already filled"
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
        const updated = await PermanentPackage.findByIdAndUpdate(item._id, data, {new:true}).populate({path:"cylinders", select:"barcode"});
        return res.status(200).json({
            "message" : "succesfully updated",
            updated : format_permanent_package_response(updated)
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

    const item = await PermanentPackage.findById(id);
    const data = {
        // filling_pressure, 
        grade, 
        batch_number
    };
    return await fillerEntryHelper(item, data, res);
});

exports.fillerEntryByBarcode = catchAsync(async(req, res, next) => {
    const barcode = req.params.barcode.toLowerCase();
    const {
        // filling_pressure, 
        grade, 
        batch_number
    } = req.body;

    const item = await PermanentPackage.findOne({barcode});
    const data = {
        // filling_pressure, 
        grade, 
        batch_number
    };
    return await fillerEntryHelper(item, data, res);
});

exports.pickUpEntryByBarcode = catchAsync(async(req,res,next) => {
    const barcode = req.params.barcode.toLowerCase();
    const {location} = req.body;
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;

    const item = await PermanentPackage.findOne({barcode});
    if(!item) {
        return res.status(404).json({
            "message" : "Item not found"
        });
    }

    const trackingStatus = item.trackingStatus;
    if(trackingStatus === 0) {
        return res.status(400).json({
            "message" : "Can't be dispatched, because the package is empty"
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
        // const trackingString = `Cylinder dispatched with bill id - ${billId} at ${currentDate.date}, ${currentDate.time} by ${req.user.email} from (${latitude},${longitude})`;
        
        trackingData.action = "dispatched";
        const tracking = await Tracking.create({
            cylinderId : item._id,
            billId: billId,
            actions: [trackingData]
        });
        item.currentTrackId = tracking._id;
        item.isDispatched = true;
        item.trackingStatus = 2;
        await item.save();
    } else if(trackingStatus === 2) {
        const tracking = await Tracking.findById(item.currentTrackId);
        // const trackingString = `Cylinder reached the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "arrived at destination";
        tracking.actions.push(trackingData);
        await tracking.save();
        item.trackingStatus = 3;
        await item.save();
    } else if(trackingStatus === 3) {
        const tracking = await Tracking.findById(item.currentTrackId);
        // const trackingString = `Cylinder picked up from the destination at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "picked up from destination"
        tracking.actions.push(trackingData);
        await tracking.save();
        item.status = "empty";
        item.trackingStatus = 4;
        await item.save();
    } else if(trackingStatus === 4) {
        const tracking = await Tracking.findById(item.currentTrackId);
        // const trackingString = `Cylinder reached SVSG at ${currentDate.date}, ${currentDate.time} by ${req.user.email} at (${latitude}, ${longitude})`;
        trackingData.action = "reached SVSG";
        tracking.actions.push(trackingData);
        await tracking.save();
        item.isDispatched = false;
        item.trackingStatus = 0;
        item.currentTrackId = null;
        await item.save();
    }

    const fetchedItem = await PermanentPackage.findById(item._id).populate("currentTrackId").populate({path:"cylinders", select:"barcode"});

    return res.status(200).json({
        "message" : "updated package",
        data : format_permanent_package_response(fetchedItem)
    })
})