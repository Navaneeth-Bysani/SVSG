const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
    company : {
        type : String,
        required : true
    },

    product_code : {
        type : String,
        required: true
    },

    date_time : {
        type : Date,
        required : true
    }
})

const trackingModel = mongoose.model("tracking", trackingSchema);