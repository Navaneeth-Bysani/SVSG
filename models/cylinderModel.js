const mongoose = require("mongoose");

const cylinderSchema = new mongoose.Schema({
    barcode : {
        type : String,
        required: true,
        unique : true
    },
    owner : {
        type : String,
        required : true
    },
    branch : {
        type : String,
        required : true
    },
    serial_number: {
        type : String,
        required : true
    },
    history : [{
        type : mongoose.Schema.ObjectId,
        ref : "tracking"
    }],
    product_code : {
        type : String,
        required : true
    },
    status : {
        type : String,
        enum : ["full", "empty"],
        required : true,
        default : "empty"
    },

    filling_pressure : {
        type : Number,
        required : true,
        default : 0
    },

    grade : {
        type : String,
        required : true,
        default : "A"
    },

    batch_number : {
        type : String,
        required : true,
        default : "Not yet Assigned"
    },

    volume : {
        type : Number,
        required : true,
        default : 0
    },

    last_test_date : {
        type : Date
    },

    manufacture_date : {
        type : Date
    },

    manufacturer : {
        type : String,
        required : true
    }
});

const cylinderModel = mongoose.model("cylinder", cylinderSchema);

module.exports = cylinderModel;