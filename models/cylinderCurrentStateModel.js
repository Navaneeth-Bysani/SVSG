const mongoose = require("mongoose");

const actionSchema = new mongoose.Schema({
        description : {
            type : String
        },
        //latitude, longitude
        coordinates : {
            latitude : {
                type : String
            },
            longitude : {
                type : String
            }
        },
        //email of performed person
        actionDoneBy : {
            type: String
        }
});

const cylinderCurrentStateSchema = new mongoose.Schema({
    cylinderId : {
        type : mongoose.Schema.ObjectId,
        ref : "cylinder",
        required : true
    },
    client : {
        type : String,
        required : true
    },
    actions : [
        {
            type: actionSchema,
            default: () => ({})
        }
    ]
})

const cylinderCurrentStateModel = mongoose.model("cylinderCurrentState", cylinderCurrentStateSchema);

module.exports = cylinderCurrentStateModel;