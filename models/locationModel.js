const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

const locationModel = mongoose.model("location", locationSchema);
module.exports = locationModel;