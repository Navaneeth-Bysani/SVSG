const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

const actionModel = mongoose.model("action", clientSchema);

module.exports = clientModel;