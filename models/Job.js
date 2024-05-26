// models/Job.js
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  j_cname: String,
  j_email: String,
  j_title: String,
  j_description: String,
  j_appdeadline: Date,
  j_u_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_at: { type: Date, default: Date.now },
  // Other fields...
});

module.exports = mongoose.model("Job", jobSchema);
