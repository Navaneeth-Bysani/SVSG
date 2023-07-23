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
        type : String,
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
        ref : "Material",
        required  :true
    }
})

const orderModel = mongoose.model("tracking", orderSchema);

module.exports = orderModel;