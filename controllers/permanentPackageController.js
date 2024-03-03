const catchAsync = require("../utils/catchAsync");
const PermanentPackage = require("./../models/permanentPackageModel");
const Cylinder = require("./../models/cylinderModel");
const {format_permanent_package_response} = require("./../utils/formatters/responseFormatters");

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
        data : format_cylinder_response(testUpdated)
    })
});