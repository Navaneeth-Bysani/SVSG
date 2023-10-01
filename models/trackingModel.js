const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
    cylinderId : {
        type: mongoose.Schema.ObjectId,
        ref : "cylinder"
    },
    actions: [
        //"Cylinder dispatched at <time> by <email_id> at (lat, long)"
        {
            type: String
        }
    ]
})

const trackingModel = mongoose.model("tracking", trackingSchema);
module.exports = trackingModel;