const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    role: [{
      type: String,
      enum: ["admin", "filler", "tester", "pickup"],
      required: true,
    }],
    picture: String,
    isSignedUp : {
      type : Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
