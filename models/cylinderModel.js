const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema({

    // to be filled by admin while adding for the first time

    barcode : {
        type : String,
        required: true,
        unique : true,
        lowercase: true
    },

    serial_number : {
        type: String,
        required: true
    },

    product_code: {
        type: String,
        required: true
    },

    volume: {
        type: String,
        required: true
    },

    manufactured_date: {
        type: Date,
        required: true
    },

    manufacturer: {
        type: String,
        required: true,
        default: "N/A"
    },


    // other details. To be entered while creating for first time only

    owner : {
        type : String,
        default: "SVSG"
    },

    branch : {
        type: String,
        default: "Hosakote"
    },

    
    // entered by filler login while filling

    status : {
        type: String,
        enum: ["full", "empty"],
        default : "empty"
    },

    filling_pressure: {
        type: String
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

    minimum_thickness: {
        type: String,
        default: ""
    },

    usage: {
        type: String,
        default: ""
    },

    valve: {
        type: String
    },
    valve_gaurd: {
        type: String
    }
});

const cylinderModel = mongoose.model("cylinder", cylinderSchema);

module.exports = cylinderModel;