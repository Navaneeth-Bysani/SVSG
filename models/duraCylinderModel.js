const mongoose = require("mongoose");

const duraCylinderSchema = new mongoose.Schema({

    // to be filled by admin while adding for the first time

    barcode : {
        type : String,
        required: true,
        unique : true,
        lowercase: true
    },

    serial_number : {
        type: String,
        required: true,
        unique: true
    },

    volume: {
        type: String,
        required: true
    },
    
    // entered by filler login while filling

    status : {
        type: String,
        enum: ["full", "empty"],
        default : "empty"
    },

    grade: {
        type: String
    },

    batch_number: {
        type: String
    },
    
    // populated automatically when tester marks as tested

    last_test_date: {
        type: Date
    },

    // helper variables to know if the cylinder is dispatched or not
    isDispatched: {
        type:Boolean,
        default: false
    },

    currentTrackId: {
        type: mongoose.Schema.ObjectId,
        ref : "tracking"
    }, 

    //                                                  status                   isDispatched
    //0 - unfilled and undispatched                      empty                      False           
    //1 - filled and ready to dispatch                   full                       False
    //2 - filled and dispatched to client place          full                       True
    //3 - filled and received at client place            full                       True   
    //4 - empty and dispatched from client place         empty                      True
    //0 - unfilled and undispatched
    trackingStatus : {
        type: Number,
        enum: [0, 1, 2, 3, 4],
        default: 0
    },

    tare_weight : {
        type: String,
        default: ""
    },

    test_due_date: {
        type: Date
    },

    valve: {
        type: String
    },

    // Extra fields additional to normal cylinder
    trv : {
        type: String
    },

    level_gauge: {
        type: String
    },

    pressure_gauge: {
        type: String
    },

    make: {
        type: String
    },

    frame: {
        type: String
    },

    adaptor: {
        type: String
    },

    service: {
        type: String
    }
});

const duraCylinderModel = mongoose.model("duracylinder", duraCylinderSchema);

module.exports = duraCylinderModel;

// barcode
// serial number 
// TRV
// Level Gauge
// Pressure Gauge
// Test due
// Make
// Weight
// Capacity
// Service
// Frame
// Valves
// Adaptor


//product_code, valve_gaurd, usage, minimum_thickness, owner, branch, manufacturer, manufactured_date
//is weight different from tare_weight? Or is it same?
//Capacity is volume
//What is service?