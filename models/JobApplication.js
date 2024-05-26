// models/JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema({
  ja_j_id: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  ja_file: Buffer,
  ja_u_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ja_message: String,
  // Other fields...
});

module.exports = mongoose.model("JobApplication", jobApplicationSchema);
