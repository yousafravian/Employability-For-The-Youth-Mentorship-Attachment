// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    userType: {
      type: String,
      enum: ["student", "employer"], // Adjust as needed
      required: true,
    },
    company: {
      type: String,
      required: function () {
        return this.userType === "employer";
      },
    },
    education: {
      type: String,
      required: function () {
        return this.userType === "student";
      },
    },
    // Add other fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
