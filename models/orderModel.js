const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    type : {
        type : String,
        required : true,
        enum : ["input", "output"]
    },
    quantity : {
        type : Number,
        required : true
    },
    company_name : {
        type : mongoose.Schema.ObjectId,
        ref : "client"
    },
    project_name : {
        type : String,
    },
    material_provided_to : {
        type : String,
    },
    manufacturer_test_certificate_available : {
        type : Boolean,
    },
    sve_tested_material : {
        type : Boolean,
    },
    materialId : {
        type : mongoose.Schema.ObjectId,
        ref : "material",
        required  :true
    },
    billed : {
        type : Boolean,
        required : true
    },
    invoice_no : {
        type : String,
        default : ""
    },
    order_created_at : {
        type : Date,
        // default : Date.now()
    }
})

const orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;