const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

const clientModel = mongoose.model("clients", clientSchema);

module.exports = clientModel;