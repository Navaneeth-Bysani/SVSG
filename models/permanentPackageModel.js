const mongoose = require("mongoose");

const permanentPackageSchema = new mongoose.Schema({

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
    
    status : {
        type: String,
        enum: ["full", "empty"],
        default : "empty"
    },

    test_date : {
        type: Date
    },

    //while adding cylinders
    working_pressure: {
        type: String
    },

    valves: {
        type: String
    },

    manifold: {
        type: String
    },
    
    wheels: {
        type: String
    },

    service: {
        type: String
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

    number_of_cylinders : {
        type: Number
    },

    cylinders : [
        {
            type: mongoose.Schema.ObjectId,
            ref: "cylinder"
        }
    ]
}, {timestamps : true});

const permanentPackageModel = mongoose.model("permanentPackage", permanentPackageSchema);

module.exports = permanentPackageModel;