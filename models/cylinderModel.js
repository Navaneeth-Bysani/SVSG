const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema({

    // to be filled by admin while adding for the first time

    barcode : {
        type : String,
        required: true,
        unique : true
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
        required: true
    },


    // other details. To be entered while creating for first time only

    owner : {
        type : String
    },

    branch : {
        type: String
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
    }
});

const cylinderModel = mongoose.model("cylinder", cylinderSchema);

module.exports = cylinderModel;