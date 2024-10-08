const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema({
    cylinderId : {
        type: mongoose.Schema.ObjectId,
        ref : "cylinder"
    },
    actions: [
        //"Cylinder dispatched at <time> by <email_id> at (lat, long)"
        {
            type: mongoose.Schema.Types.Object
        }
    ],
    billId: {
        type: String
    }
}, { timestamps: true })

const trackingModel = mongoose.model("tracking", trackingSchema);
module.exports = trackingModel;