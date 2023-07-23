const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
    barcode : {
        type : String,
        required: true,
        unique : true
    },
    equipment_details : {
        type : String,
        required : true
    },
    moc : {
        type : String,
        required : true
    },
    size : {
        type : String,
        required : true
    },
    additional_details : {
        type : String
    },
    available_quanity : {
        type : Number,
        required : true,
        default : 0
    },
    minimum_quantity : {
        type : Number,
        required : true,
        default : 0
    }
});

const materialModel = mongoose.model("material", materialSchema);

module.exports = materialModel;